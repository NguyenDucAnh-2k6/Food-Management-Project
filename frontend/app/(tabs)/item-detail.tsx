import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ItemDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const item = params.itemData ? JSON.parse(params.itemData as string) : null;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Không tìm thấy dữ liệu thực phẩm!</Text>
        <Button title="Quay lại Tủ Lạnh" onPress={() => router.replace('/(tabs)')} />
      </View>
    );
  }

  const handleCook = () => {
    setModalVisible(false);
    Alert.alert(
      "Đã nấu thành công!",
      `Hệ thống đã xóa [${item.name}] và tự động dọn dẹp các nguyên liệu phụ khỏi tủ lạnh.`
    );
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>

      <View style={styles.detailCard}>
        <Text style={styles.sectionTitle}> Kết Quả Nhận Diện Từ Cam AI</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Tình trạng hiện tại:</Text>
          <Text style={item.status === 'Tươi' ? styles.freshStatus : styles.warningStatus}>
            ● {item.status}
          </Text>
        </View>

        <Text style={styles.label}>Lý do AI đánh giá:</Text>
        {item.reasons?.map((reason: string, idx: number) => (
          <Text key={idx} style={styles.bullet}>• {reason}</Text>
        ))}

        <View style={styles.divider} />

        <Text style={styles.infoText}>📅 Ngày cất vào tủ: {item.purchaseDate}</Text>
        <Text style={styles.infoText}>⏳ Hạn dùng dự kiến: {item.expDate}</Text>
        <Text style={styles.infoText}>🌡️ Nhiệt độ bảo quản: {item.temp}</Text>
      </View>

      <Text style={styles.sectionHeader}>💡 Gợi Ý Món Ăn Chế Biến từ AI</Text>
      {item.suggestedRecipes?.map((recipe: any, idx: number) => (
        <TouchableOpacity
          key={idx}
          style={styles.recipeCard}
          onPress={() => {
            setSelectedRecipe(recipe);
            setModalVisible(true);
          }}
        >
          <Text style={styles.recipeTitle}>🍲 {recipe.name}</Text>
          <Text style={styles.recipeSub}>Nguyên liệu phụ đi kèm: {recipe.subIngredients?.join(', ')}</Text>
        </TouchableOpacity>
      ))}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nấu món: {selectedRecipe?.name}?</Text>
            <Text style={styles.modalText}>
              Bạn có muốn hệ thống tự động xóa món **{item.name}** cùng các nguyên liệu phụ (**{selectedRecipe?.subIngredients?.join(', ')}**) khỏi tủ lạnh không?
            </Text>
            <View style={styles.btnRow}>
              <Button title="Hủy" color="#888" onPress={() => setModalVisible(false)} />
              <Button title="Xác nhận Nấu & Dọn tủ" color="#d32f2f" onPress={handleCook} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', marginBottom: 12 },
  detailCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontWeight: 'bold', color: '#444', marginTop: 6 },
  freshStatus: { color: '#2e7d32', fontWeight: 'bold', fontSize: 16 },
  warningStatus: { color: '#e65100', fontWeight: 'bold', fontSize: 16 },
  bullet: { color: '#666', marginLeft: 8, fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  infoText: { fontSize: 14, color: '#333', marginVertical: 3 },
  sectionHeader: { fontSize: 17, fontWeight: 'bold', color: '#1b5e20', marginBottom: 10 },
  recipeCard: { backgroundColor: '#e8f5e9', padding: 14, borderRadius: 8, marginBottom: 10 },
  recipeTitle: { fontSize: 16, fontWeight: 'bold', color: '#1b5e20' },
  recipeSub: { color: '#444', marginTop: 4, fontSize: 13, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#1b5e20' },
  modalText: { color: '#555', marginBottom: 16, lineHeight: 20 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between' }
});
