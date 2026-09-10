import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import TutorDataStatus from './TutorDataStatus';

export default function PetClinicSelector({ query, selectedId, onSelect, disabled, error }) {
  const [pendingId, setPendingId] = useState(null);
  const clinics = query.isError ? [] : query.data ?? [];
  const pending = clinics.find((clinic) => clinic.id === pendingId);
  return <View className="gap-2">
    <Text className="font-sans-semibold text-title text-ink">Clínica do pet</Text>
    <TutorDataStatus query={query} label="clínicas" empty={clinics.length === 0} />
    <ScrollView style={{ maxHeight: 240 }} nestedScrollEnabled>
      {clinics.map((clinic) => <Pressable key={clinic.id} accessibilityRole="button"
        accessibilityState={{ selected: selectedId === clinic.id, disabled }}
        disabled={disabled} onPress={() => setPendingId(clinic.id)}
        className={`mb-2 rounded-control border p-3 ${selectedId === clinic.id ? 'border-clinic bg-clinic-50' : 'border-line bg-card'}`}>
        <Text className="font-sans-medium text-body text-ink">{clinic.nome}</Text>
        <Text className="font-sans text-label text-slate">{clinic.endereco}</Text>
        {selectedId === clinic.id && <Text className="font-sans text-label text-clinic">Selecionada</Text>}
      </Pressable>)}
    </ScrollView>
    {error && <Text accessibilityRole="alert" className="font-sans text-label text-alert">{error}</Text>}
    <Modal visible={pendingId !== null} transparent animationType="fade" onRequestClose={() => setPendingId(null)}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View accessibilityViewIsModal className="w-full max-w-lg gap-4 rounded-card bg-card p-5">
          <Text accessibilityRole="header" className="font-sans-semibold text-title text-ink">Confirme a clínica</Text>
          <Text className="font-sans text-body text-slate">
            {pending ? `Você selecionou ${pending.nome}. Após salvar o pet, não será possível alterar a clínica escolhida pelo aplicativo.` : 'Esta clínica não está disponível. Volte e atualize a lista.'}
          </Text>
          <Pressable accessibilityRole="button" disabled={!pending || disabled || query.isFetching}
            onPress={() => { if (pending && !disabled && !query.isFetching) { onSelect(pending.id); setPendingId(null); } }}
            className="items-center rounded-control bg-clinic px-4 py-3">
            <Text className="font-sans-semibold text-body text-white">Entendi, selecionar</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => setPendingId(null)} className="items-center py-2">
            <Text className="font-sans-medium text-body text-clinic">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  </View>;
}
