import React, { useState, useRef } from "react";
import { Modal, View, Text, Pressable, ScrollView, Platform } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "../common/Input";
import PetAvatar from "./PetAvatar";
import { useCreateReminder, useUpdateReminder, useReminder } from "../../hooks/useReminders";
import { formatReminderDate, getReminderErrorMessage, parseReminderDate, serializeReminderDate, validateReminderText } from "../../utils/reminderUtils";
import ReminderQueryStatus from "./ReminderQueryStatus";

const TYPE_OPTIONS = [
  { key: "VACINA", label: "Vacina" },
  { key: "RETORNO", label: "Retorno" },
  { key: "MEDICAMENTO", label: "Medicamento" },
  { key: "CHECKUP", label: "Checkup" },
  { key: "VERMÍFUGO", label: "Vermífugo" },
];

const EditReminder = ({ id, onClose, pets }) => {
  const query = useReminder(id);
  if (query.isPending || query.error || !query.data) return (
    <Modal visible transparent onRequestClose={onClose}>
      <View className="flex-1 justify-center bg-black/40 p-4"><View className="rounded-card bg-card p-4">
        <ReminderQueryStatus query={query} />
        {!query.isPending && !query.error && <Text>Lembrete não encontrado.</Text>}
        <Pressable onPress={onClose}><Text className="text-clinic">Fechar</Text></Pressable>
      </View></View>
    </Modal>
  );
  return <ReminderForm key={id} onClose={onClose} pets={pets} reminder={query.data} />;
};

const NewReminderModal = ({ visible, onClose, pets = [], reminderId = null }) => {
  if (!visible) return null;
  return reminderId === null ? <ReminderForm onClose={onClose} pets={pets} /> : <EditReminder id={reminderId} onClose={onClose} pets={pets} />;
};

const ReminderForm = ({ onClose, pets, reminder = null }) => {
  const create = useCreateReminder();
  const update = useUpdateReminder();
  const mutation = reminder ? update : create;
  const submitting = useRef(false);
  const [type, setType] = useState(reminder?.tipo ?? "VACINA");
  const [petId, setPetId] = useState(pets?.[0]?.id || null);
  const [description, setDescription] = useState(reminder?.descricao ?? "");
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState(() => serializeReminderDate(new Date()).slice(0, 10));
  const selectedDate = Platform.OS === "web" ? parseReminderDate(dateText) : date;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [touched, setTouched] = useState(false);

  const selectedPet = pets.find((pet) => pet.id === petId) ?? (petId === null ? pets[0] : undefined);

  const isDescriptionValid = description.trim().length > 0;
  const error =
    touched && !isDescriptionValid ? "A descrição é obrigatória" : null;

  const closeAndReset = () => {
    if (!mutation.isPending) onClose();
  };

  const handleSave = async () => {
    setTouched(true);
    if (isSaveDisabled || submitting.current) return;
    submitting.current = true;
    try {
      if (reminder) await update.mutateAsync({ id: reminder.id, tipo: type, descricao: description });
      else await create.mutateAsync({ tipo: type, descricao: description, date: selectedDate, petId: selectedPet.id });
      onClose();
    } catch {
      // A mutation mantém o formulário aberto e fornece o erro visual.
    } finally {
      submitting.current = false;
    }
  };

  // O seletor e um dialog: fecha ao escolher a data ou ao cancelar.
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "dismissed") return;
    if (selectedDate) setDate(selectedDate);
  };

  const isSaveDisabled = mutation.isPending || !validateReminderText(type, description) || (!reminder && (!selectedPet || !Number.isFinite(selectedDate.getTime())));

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={closeAndReset}
    >
      <View className="flex-1 justify-center bg-black/40 p-4">
        <ScrollView className="max-h-[90%] rounded-card border border-line bg-card" contentContainerClassName="p-[14px]">
          <Text className="mb-[14px] font-sans-semibold text-title text-ink">
            {reminder ? "Editar lembrete" : "Novo lembrete"}
          </Text>

          <Text className="mb-[6px] font-sans text-label text-slate">Tipo</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-1"
            className="mb-3"
          >
            {TYPE_OPTIONS.map((t) => {
              const isActive = type === t.key;

              return (
                <Pressable
                  key={t.key}
                  disabled={mutation.isPending}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => setType(t.key)}
                  style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
                  className={`rounded-badge px-[10px] py-[5px] ${isActive ? "bg-clinic-50" : ""}`}
                >
                  <Text
                    className={`font-sans-medium text-eyebrow ${isActive ? "text-clinic-ink" : "text-slate"}`}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Input label="Tipo" value={type} onChangeText={setType} maxLength={50} editable={!mutation.isPending} />
          {!reminder && <>
          <Text className="mb-[6px] font-sans text-label text-slate">Pet</Text>
          <View className="mb-3 max-h-36">
            <ScrollView>
              {pets.map((p) => (
                <Pressable
                  key={p.id}
                  disabled={mutation.isPending}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedPet?.id === p.id }}
                  className="flex-row items-center gap-3 py-2"
                  style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
                  onPress={() => setPetId(p.id)}
                >
                  <PetAvatar pet={p} size={32} />
                  <View className="flex-1">
                    <Text className="font-sans-medium text-body text-ink">
                      {p.nome}
                    </Text>
                    <Text className="font-sans text-label text-slate">
                      {p.raca || p.especie}
                    </Text>
                  </View>
                  {selectedPet?.id === p.id ? <Feather name="check" size={16} color="#0E7A63" /> : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
          </>}

          <Input
            label="Descrição"
            placeholder="Ex: Reforço da V10"
            value={description}
            editable={!mutation.isPending}
            onChangeText={setDescription}
            onBlur={() => setTouched(true)}
            error={error}
            isValid={touched && isDescriptionValid}
          />

          {reminder ? <Text className="font-sans text-label text-slate">
            Pet #{reminder.petId} · {formatReminderDate(reminder.dataPrevista)}. Pet e data não podem ser alterados.
          </Text> : <>
          <Text className="mb-[6px] font-sans text-label text-slate">Data</Text>
          {Platform.OS === "web" ? <Input label="Data (AAAA-MM-DD)"
            value={dateText} error={!Number.isFinite(selectedDate.getTime()) ? "Informe uma data válida em AAAA-MM-DD." : undefined}
            editable={!mutation.isPending} onChangeText={setDateText} /> : <>
          <Pressable
            disabled={mutation.isPending}
            accessibilityRole="button"
            onPress={() => setShowDatePicker(true)}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="mb-3 justify-center rounded-control border border-line-strong bg-card px-3 py-[10px]"
          >
            <Text className="font-mono text-body text-ink">
              {date ? date.toLocaleDateString("pt-BR") : "Selecionar data"}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="calendar"
              onChange={onChangeDate}
            />
          )}
          </>}
          </>}

          {mutation.error && <Text accessibilityRole="alert" className="font-sans text-body text-alert">{getReminderErrorMessage(mutation.error)}</Text>}

          <View className="mt-[14px] flex-row justify-end gap-[10px]">
            <Pressable
              accessibilityRole="button"
              onPress={closeAndReset}
              disabled={mutation.isPending}
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
              className="items-center justify-center rounded-control border border-line-strong bg-card px-[18px] py-[11px]"
            >
              <Text className="font-sans-medium text-xs text-ink">Cancelar</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handleSave}
              disabled={isSaveDisabled}
              style={({ pressed }) => [
                isSaveDisabled ? { opacity: 0.4 } : null,
                pressed ? { opacity: 0.7 } : null,
              ]}
              className="items-center justify-center rounded-control bg-clinic px-5 py-3"
            >
              <Text className="font-sans-semibold text-title text-white">{mutation.isPending ? "Salvando..." : "Salvar"}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default NewReminderModal;
