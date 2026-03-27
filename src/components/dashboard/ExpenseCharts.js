import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LineChart as LucideLineChart } from 'lucide-react-native';
import { prepareChartData } from '../../utils/financialMetrics';

const { width } = Dimensions.get('window');

const ExpenseCharts = ({ expenses, timePeriod = 'monthly' }) => {
 // Generate real data from expenses
 const { barData } = prepareChartData(expenses, timePeriod);
 
 // Fallback data if no expenses
 const defaultLabels = ["W1", "W2", "W3", "W4"];
 const defaultValues = [0, 0, 0, 0];

 const chartLabels = barData.length > 0 ? barData.map(d => d.name.split(' ')[0]) : defaultLabels;
 const chartValues = barData.length > 0 ? barData.map(d => d.value) : defaultValues;

 const chartConfig = {
 backgroundGradientFrom: "transparent",
 backgroundGradientFromOpacity: 0,
 backgroundGradientTo: "transparent",
 backgroundGradientToOpacity: 0,
 color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
 strokeWidth: 3,
 barPercentage: 0.6,
 useShadowColorFromDataset: false,
 decimalPlaces: 0,
 labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
 propsForDots: {
 r: "6",
 strokeWidth: "2",
 stroke: "#4f46e5"
 }
 };

 const data = {
 labels: chartLabels.slice(-6), // Show last 6 data points
 datasets: [
 {
 data: chartValues.slice(-6).map(v => v || 0),
 color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
 strokeWidth: 4
 }
 ]
 };

 return (
 <View>
 <View className="flex-row items-center justify-between mb-8">
 <View className="flex-row items-center space-x-4">
 <View className="w-12 h-12 rounded-2xl bg-indigo-500/10 items-center justify-center border border-indigo-500/20">
 <LucideLineChart size={24} color="#818cf8" strokeWidth={2.5} />
 </View>
 <View>
 <Text className="text-xl font-black text-white uppercase tracking-tight">Flux Analytics</Text>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mt-1">
 {timePeriod === 'quarterly' ? 'Quarterly' : 'Weekly'} capital dispersion
 </Text>
 </View>
 </View>
 </View>

 <View className="items-center -ml-6">
 <LineChart
 data={data}
 width={width - 24}
 height={220}
 chartConfig={chartConfig}
 bezier
 style={{
 marginVertical: 8,
 borderRadius: 16
 }}
 withVerticalLines={false}
 withHorizontalLines={false}
 withShadow={true}
 fromZero={true}
 />
 </View>

 <View className="flex-row items-center justify-between mt-8 p-6 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
 <View className="flex-row items-center space-x-3">
 <View className="w-3 h-3 rounded-full bg-indigo-500" />
 <Text className="text-xs font-black text-slate-500 uppercase tracking-widest">Growth Cluster</Text>
 </View>
 <Text className="text-sm leading-[22px] font-black text-white">
 {expenses.length > 0 ? "Active" : "Neutral"}
 </Text>
 </View>
 </View>
 );
};

export default ExpenseCharts;
