import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Badge from "../common/Badge";
import Input from "../common/Input";

const TYPE_OPTIONS = [
  { key: "VACINA", label: "Vacina", emoji: "💉" },
  { key: "RETORNO", label: "Retorno", emoji: "🔄" },
  { key: "MEDICAMENTO", label: "Medicamento", emoji: "💊" },
  { key: "CHECKUP", label: "Checkup", emoji: "🩺" },
  { key: "VERMÍFUGO", label: "Vermífugo", emoji: "🪱" },
];

const NewReminderModal = ({ visible, onClose, onSave, pets = [] }) => {
  const [type, setType] = useState("VACINA");
  const [petId, setPetId] = useState(pets?.[0]?.id || null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [touched, setTouched] = useState(false);

  const isDescriptionValid = description.trim().length > 0;
  const error =
    touched && !isDescriptionValid ? "A descrição é obrigatória" : null;

  const reset = () => {
    setType("VACINA");
    setPetId(pets?.[0]?.id || null);
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
    if (!petId || !description || !date) return;
    const pet = pets.find((p) => p.id === petId) || {};
    const payload = {
      id: String(Date.now()),
      petId,
      petName: pet.name || pet.petName || "Pet",
      petAvatar: pet.avatar || "🐾",
      petColor: pet.color || "#EEE",
      type,
      description,
      dueDate: date,
      completed: false,
    };
    onSave && onSave(payload);
    reset();
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  let DateTimePicker = null;
  try {
    DateTimePicker = require("@react-native-community/datetimepicker").default;
  } catch (e) {
    DateTimePicker = null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeAndReset}
    >
      <View className="flex-1 justify-center bg-black/40 p-4">
        <View className="rounded-3xl bg-white p-4">
          <Text className="mb-4 text-lg font-bold text-slate-900">
            Novo lembrete
          </Text>

          <Text className="mb-1 text-xs text-slate-500">Tipo</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="mb-3 space-x-2"
          >
            {TYPE_OPTIONS.map((t) => (
              <TouchableOpacity
                key={t.key}
                className={`rounded-full border px-4 py-2 ${type === t.key ? "border-cyan-600 bg-cyan-600" : "border-slate-200 bg-white"}`}
                onPress={() => setType(t.key)}
              >
                <Text className="text-base">
                  {t.emoji} {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text className="mb-1 text-xs text-slate-500">Pet</Text>
          <View className="mb-3 max-h-36">
            <ScrollView>
              {pets.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  className="flex-row items-center space-x-3 py-2"
                  onPress={() => setPetId(p.id)}
                >
                  <View
                    className="h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: p.color || "#EEE" }}
                  >
                    <Text className="text-lg">{p.avatar || "🐾"}</Text>
                  </View>
                  <View>
                    <Text className="font-semibold text-slate-900">
                      {p.name || p.petName}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {p.breed || p.species || ""}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Input
            label="Descrição"
            placeholder="Ex: Reforço da V10"
            value={description}
            onChangeText={setDescription}
            onBlur={() => setTouched(true)}
            error={error}
            isValid={touched && isDescriptionValid}
          />

          <Text className="mb-1 text-xs text-slate-500">Data</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="mb-3 justify-center rounded-2xl border border-slate-200 px-4 py-3"
          >
            <Text>
              {date ? date.toLocaleDateString("pt-BR") : "Selecionar data"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && DateTimePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="calendar"
              onChange={onChangeDate}
            />
          )}

          <View className="mt-4 flex-row justify-end space-x-3">
            <TouchableOpacity
              className="rounded-2xl px-4 py-3"
              onPress={closeAndReset}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`rounded-2xl px-4 py-3 ${!petId || !description || !date ? "bg-cyan-600/50" : "bg-cyan-600"}`}
              onPress={handleSave}
              disabled={!petId || !description || !date}
            >
              <Text className="font-semibold text-white">Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NewReminderModal;
