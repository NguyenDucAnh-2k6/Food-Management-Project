import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Button, 
  Modal, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Danh sách thực phẩm trong tủ lạnh (Ban đầu rỗng)
  const [fridgeItems, setFridgeItems] = useState<any[]>([]);

  // Lắng nghe dữ liệu MỚI ĐƯỢC GỬI SANG từ Cam AI sau khi quét
  React.useEffect(() => {
    if (params.scannedItemData) {
      try {
        const newItem = JSON.parse(params.scannedItemData as string);
        
        setFridgeItems(prevItems => {
          const isExist = prevItems.some(item => item.id === newItem.id);
          if (isExist) return prevItems;
          return [newItem, ...prevItems];
        });
      } catch (e) {
        console.log("Lỗi đọc dữ liệu từ Cam AI", e);
      }
    }
  }, [params.scannedItemData]);

  // Management State
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const handleOpenDetail = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleSelectRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setConfirmModalVisible(true);
  };

  const handleConfirmCook = () => {
    if (!selectedItem) return;

    const itemName = selectedItem.name;
    const itemId = selectedItem.id;

    // Xóa món đã nấu
    setFridgeItems(prev => prev.filter(i => i.id !== itemId));

    setConfirmModalVisible(false);
    setModalVisible(false);
    setSelectedItem(null);

    Alert.alert(
      "Thành công! 🎉",
      `Đã nấu xong món ${selectedRecipe?.name}. Hệ thống đã xóa [${itemName}] và dọn dẹp các nguyên liệu phụ liên quan khỏi tủ lạnh.`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tủ Lạnh Nhà Bạn 🥩🥦</Text>

      {fridgeItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🧊</Text>
          <Text style={styles.emptyText}>Tủ lạnh chưa có thực phẩm nào!</Text>
          <Text style={styles.emptySubText}>
            Hãy bấm nút bên dưới để quét thực phẩm từ Cam AI và lưu vào tủ nhé.
          </Text>
        </View>
      ) : (
        <FlatList
          data={fridgeItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => handleOpenDetail(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={item.status === 'Tươi' ? styles.statusFresh : styles.statusWarning}>
                  ● {item.status}
                </Text>
              </View>
              <Text style={styles.subText}>📅 Ngày cất: {item.purchaseDate}</Text>
              <Text style={styles.subText}>⏳ Hạn dùng dự kiến: {item.expDate}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Đường dẫn mở tab scan-result */}
      <Button
        title="📸 QUÉT THỰC PHẨM BẰNG CAM AI"
        color="#2e7d32"
        onPress={() => router.push('/(tabs)/scan-result')}
      />

      {/* POPUP CHI TIẾT MÓN ÁN */}
      {selectedItem && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>

                <View style={styles.detailCard}>
                  <Text style={styles.sectionTitle}>📌 Kết Quả Nhận Diện Từ Cam AI</Text>
                  
                  <View style={styles.row}>
                    <Text style={styles.label}>Tình trạng thực phẩm:</Text>
                    <Text style={selectedItem.status === 'Tươi' ? styles.statusFresh : styles.statusWarning}>
                      ● {selectedItem.status}
                    </Text>
                  </View>

                  <Text style={styles.label}>Lý do AI phân tích:</Text>
                  {selectedItem.reasons?.map((reason: string, idx: number) => (
                    <Text key={idx} style={styles.bullet}>• {reason}</Text>
                  ))}

                  <View style={styles.divider} />

                  <Text style={styles.infoText}>📅 Ngày cất vào tủ: {selectedItem.purchaseDate}</Text>
                  <Text style={styles.infoText}>⏳ Hạn dùng dự kiến: {selectedItem.expDate}</Text>
                  <Text style={styles.infoText}>🌡️ Nhiệt độ bảo quản: {selectedItem.temp}</Text>
                </View>

                <Text style={styles.sectionHeader}>
                  💡 Gợi Ý Món Ăn Chế Biến ({selectedItem.suggestedRecipes?.length || 0} món)
                </Text>
                
                {selectedItem.suggestedRecipes?.map((recipe: any, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.recipeItem}
                    onPress={() => handleSelectRecipe(recipe)}
                  >
                    <View style={styles.recipeHeader}>
                      <Text style={styles.recipeName}>🍲 {recipe.name}</Text>
                      <Text style={styles.cookBtnText}>Nấu món này ➔</Text>
                    </View>
                    <Text style={styles.recipeSub}>
                      Cần thêm nguyên liệu phụ: {recipe.subIngredients?.join(', ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={{ marginTop: 12 }}>
                <Button title="Đóng" color="#666" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* POPUP HỎI XÓA NGUYÊN LIỆU PHỤ TỰ ĐỘNG */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#fff' }]}>
            <Text style={styles.modalTitle}>Nấu món: {selectedRecipe?.name}?</Text>
            <Text style={styles.modalText}>
              Hệ thống nhận thấy bạn chuẩn bị nấu món này. Bạn có muốn tự động xóa **{selectedItem?.name}** cùng các nguyên liệu phụ liên quan (**{selectedRecipe?.subIngredients?.join(', ')}**) khỏi tủ lạnh không?
            </Text>
            <View style={styles.btnRow}>
              <Button title="Hủy" color="#888" onPress={() => setConfirmModalVisible(false)} />
              <Button title="Xác Nhận Nấu & Tự Dọn Tủ" color="#d32f2f" onPress={handleConfirmCook} />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1b5e20' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666' },
  emptySubText: { fontSize: 13, color: '#999', marginTop: 6, textAlign: 'center', lineHeight: 18 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusFresh: { color: '#2e7d32', fontWeight: 'bold' },
  statusWarning: { color: '#e65100', fontWeight: 'bold' },
  subText: { color: '#666', marginTop: 4, fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', padding: 18, borderRadius: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1b5e20', marginBottom: 10 },
  detailCard: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontWeight: 'bold', color: '#444', marginTop: 4, fontSize: 12 },
  bullet: { color: '#666', marginLeft: 8, fontSize: 12 },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 8 },
  infoText: { fontSize: 12, color: '#333', marginVertical: 2 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#1b5e20', marginBottom: 8 },
  recipeItem: { backgroundColor: '#e8f5e9', padding: 10, borderRadius: 6, marginBottom: 6 },
  recipeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recipeName: { fontSize: 14, fontWeight: 'bold', color: '#1b5e20' },
  cookBtnText: { fontSize: 12, color: '#0277bd', fontWeight: 'bold' },
  recipeSub: { color: '#555', marginTop: 2, fontSize: 12 },
  modalText: { color: '#444', marginVertical: 12, lineHeight: 20 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }
});
