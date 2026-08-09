import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function ScanResultScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [foodName, setFoodName] = useState('');
  const [qualityStatus, setQualityStatus] = useState('');
  const [freshnessReasons, setFreshnessReasons] = useState<string[]>([]);
  const [storedDate, setStoredDate] = useState('');
  const [expDate, setExpDate] = useState('');
  const [recommendedTemp, setRecommendedTemp] = useState('');
  const [suggestedRecipes, setSuggestedRecipes] = useState<any[]>([]);

  // Giả lập nhận diện từ Cam AI
  const handleAnalyzeImage = async () => {
    setLoading(true);
    setImageUri('https://via.placeholder.com/300');

    setTimeout(() => {
      const aiResponse = {
        food_name: "Thịt bắp bò",
        quality_status: "Tươi",
        freshness_reasons: [
          "Thớ thịt màu đỏ tươi đặc trưng",
          "Độ đàn hồi cơ bắp tốt",
          "Không có dấu hiệu chảy nhớt"
        ],
        stored_date: "09/08/2026",
        exp_date: "13/08/2026",
        recommended_temp: "0°C - 4°C (Ngăn mát)",
        suggested_recipes: [
          { name: "Phở Bắp Bò", subIngredients: ["Xương bò", "Hành tây", "Hành ngò"] },
          { name: "Bắp Bò Luộc Mắm", subIngredients: ["Sả", "Gừng", "Tỏi"] },
          { name: "Bắp Bò Xào Cần Tây", subIngredients: ["Cần tây", "Hành tây"] }
        ]
      };

      setFoodName(aiResponse.food_name);
      setQualityStatus(aiResponse.quality_status);
      setFreshnessReasons(aiResponse.freshness_reasons);
      setStoredDate(aiResponse.stored_date);
      setExpDate(aiResponse.exp_date);
      setRecommendedTemp(aiResponse.recommended_temp);
      setSuggestedRecipes(aiResponse.suggested_recipes);

      setLoading(false);
    }, 1500);
  };

  const handleSaveToFridge = (continueScanning: boolean) => {
    if (!foodName) {
      Alert.alert("Chưa có dữ liệu", "Vui lòng bấm nút 'Chụp / Quét Ảnh Cam AI' trước!");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: foodName,
      status: qualityStatus || 'Tươi',
      reasons: freshnessReasons,
      purchaseDate: storedDate,
      expDate: expDate,
      temp: recommendedTemp,
      suggestedRecipes: suggestedRecipes
    };

    Alert.alert("Thành công", `Đã thêm [${foodName}] vào tủ lạnh!`);

    if (continueScanning) {
      setFoodName('');
      setImageUri(null);
    } else {
      // Quay lại tab chính tủ lạnh
      router.replace({
        pathname: '/(tabs)',
        params: { scannedItemData: JSON.stringify(newItem) }
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Quét Thực Phẩm Từ Cam AI 📸</Text>

      <View style={styles.scanBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.scanPlaceholderText}>Chưa có hình ảnh thực phẩm nào</Text>
        )}

        <Button 
          title="📸 BẤM ĐỂ GIẢ LẬP QUÉT CAM AI" 
          color="#0277bd"
          onPress={handleAnalyzeImage} 
        />
      </View>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Cam AI đang nhận diện thực phẩm & dự đoán hạn dùng...</Text>
        </View>
      )}

      {foodName !== '' && !loading && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kết quả nhận diện (Người dùng có thể sửa nếu sai):</Text>

          <Text style={styles.label}>Tên thực phẩm:</Text>
          <TextInput style={styles.input} value={foodName} onChangeText={setFoodName} />

          <Text style={styles.label}>Đánh giá độ tươi từ AI:</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>🟢 {qualityStatus}</Text>
          </View>

          <Text style={styles.subLabel}>Căn cứ nhận diện:</Text>
          {freshnessReasons.map((reason, idx) => (
            <Text key={idx} style={styles.bullet}>• {reason}</Text>
          ))}

          <Text style={styles.label}>Ngày cất vào tủ:</Text>
          <TextInput style={styles.input} value={storedDate} onChangeText={setStoredDate} />

          <Text style={styles.label}>Hạn dùng dự đoán (Big Data):</Text>
          <TextInput style={styles.input} value={expDate} onChangeText={setExpDate} />

          <Text style={styles.label}>Nhiệt độ bảo quản gợi ý:</Text>
          <TextInput style={styles.input} value={recommendedTemp} onChangeText={setRecommendedTemp} />

          <View style={styles.btnRow}>
            <View style={{ flex: 0.48 }}>
              <Button title="Lưu & Quét Tiếp" color="#0277bd" onPress={() => handleSaveToFridge(true)} />
            </View>
            <View style={{ flex: 0.48 }}>
              <Button title="Lưu & Xem Tủ" color="#2e7d32" onPress={() => handleSaveToFridge(false)} />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#1b5e20', marginBottom: 16 },
  scanBox: { backgroundColor: '#fff', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  scanPlaceholderText: { color: '#888', fontStyle: 'italic', marginBottom: 12 },
  previewImage: { width: '100%', height: 160, borderRadius: 8, marginBottom: 12 },
  loadingBox: { padding: 20, alignItems: 'center' },
  loadingText: { color: '#2e7d32', marginTop: 8, fontWeight: 'bold', textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#d32f2f', marginBottom: 8 },
  label: { fontWeight: 'bold', marginTop: 8, color: '#333', fontSize: 12 },
  subLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 4, backgroundColor: '#fafafa' },
  statusBadge: { backgroundColor: '#e8f5e9', padding: 6, borderRadius: 6, marginTop: 4, alignSelf: 'flex-start' },
  statusText: { color: '#2e7d32', fontWeight: 'bold' },
  bullet: { color: '#666', marginLeft: 8, fontSize: 12, marginTop: 2 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }
});
