import React, { useState } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "../common/Input";
import PetAvatar from "./PetAvatar";

const TYPE_OPTIONS = [
  { key: "VACINA", label: "Vacina" },
  { key: "RETORNO", label: "Retorno" },
  { key: "MEDICAMENTO", label: "Medicamento" },
  { key: "CHECKUP", label: "Checkup" },
  { key: "VERMÍFUGO", label: "Vermífugo" },
];

const NewReminderModal = ({ visible, onClose, onSave, pets = [] }) => {
  const [type, setType] = useState("VACINA");
  const [petId, setPetId] = useState(pets?.[0]?.id || null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [touched, setTouched] = useState(false);

  const selectedPet = pets.find((pet) => pet.id === petId) ?? (petId === null ? pets[0] : undefined);

  const isTitleValid = title.trim().length > 0;
  const titleError = touched && !isTitleValid ? "O título é obrigatório" : null;
  const isDescriptionValid = description.trim().length > 0;
  const error =
    touched && !isDescriptionValid ? "A descrição é obrigatória" : null;

  const reset = () => {
    setType("VACINA");
    setPetId(pets?.[0]?.id || null);
    setTitle("");
    setDescription("");
    setDate(new Date());
    setShowDatePicker(false);
    setTouched(false);
  };

  const closeAndReset = () => {
    reset();
    onClose && onClose();
  };

  const handleSave = () => {
    setTouched(true);
    if (!selectedPet || !isTitleValid || !description || !date) return;
    const payload = {
      id: String(Date.now()),
      petId: selectedPet.id,
      petName: selectedPet.nome,
      type,
      title: title.trim(),
      description,
      dueDate: date,
      completed: false,
    };
    onSave && onSave(payload);
    reset();
  };

  // O seletor e um dialog: fecha ao escolher a data ou ao cancelar.
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "dismissed") return;
    if (selectedDate) setDate(selectedDate);
  };

  const isSaveDisabled = !selectedPet || !title.trim() || !description || !date;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeAndReset}
    >
      <View className="flex-1 justify-center bg-black/40 p-4">
        <View className="rounded-card border border-line bg-card p-[14px]">
          <Text className="mb-[14px] font-sans-semibold text-title text-ink">
            Novo lembrete
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

          <Text className="mb-[6px] font-sans text-label text-slate">Pet</Text>
          <View className="mb-3 max-h-36">
            <ScrollView>
              {pets.map((p) => (
                <Pressable
                  key={p.id}
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

          <Input
            label="Título"
            placeholder="Ex: Vacina V10"
            value={title}
            onChangeText={setTitle}
            onBlur={() => setTouched(true)}
            error={titleError}
            isValid={touched && isTitleValid}
          />

          <Input
            label="Descrição"
            placeholder="Ex: Reforço da V10"
            value={description}
            onChangeText={setDescription}
            onBlur={() => setTouched(true)}
            error={error}
            isValid={touched && isDescriptionValid}
          />

          <Text className="mb-[6px] font-sans text-label text-slate">Data</Text>
          <Pressable
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

          <View className="mt-[14px] flex-row justify-end gap-[10px]">
            <Pressable
              accessibilityRole="button"
              onPress={closeAndReset}
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
              <Text className="font-sans-semibold text-title text-white">Salvar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NewReminderModal;
