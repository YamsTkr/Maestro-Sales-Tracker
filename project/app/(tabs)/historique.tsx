import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { TrendingUp, Calendar, ChartBar as BarChart, ChartLine as LineChartIcon, ChevronDown } from 'lucide-react-native';
import { LineChart, BarChart as RNBarChart } from 'react-native-chart-kit';

interface HistoryData {
  date: string;
  portes: number;
  vus: number;
  closes: number;
  telephones: number;
  ventes: number;
}

type FilterType = 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'thisYear';
type ChartType = 'line' | 'bar';

const screenWidth = Dimensions.get('window').width;

export default function Historique() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('thisWeek');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  
  // Données étendues pour couvrir plusieurs mois et années
  const mockData: HistoryData[] = [
    // Janvier 2024
    { date: '15/01/2024', portes: 45, vus: 18, closes: 12, telephones: 5, ventes: 2 },
    { date: '16/01/2024', portes: 52, vus: 22, closes: 15, telephones: 7, ventes: 3 },
    { date: '17/01/2024', portes: 38, vus: 16, closes: 10, telephones: 4, ventes: 1 },
    { date: '18/01/2024', portes: 60, vus: 25, closes: 18, telephones: 8, ventes: 4 },
    { date: '19/01/2024', portes: 35, vus: 14, closes: 9, telephones: 3, ventes: 1 },
    { date: '20/01/2024', portes: 48, vus: 20, closes: 14, telephones: 6, ventes: 2 },
    { date: '21/01/2024', portes: 55, vus: 23, closes: 16, telephones: 9, ventes: 3 },
    
    // Février 2024
    { date: '01/02/2024', portes: 42, vus: 19, closes: 13, telephones: 6, ventes: 2 },
    { date: '02/02/2024', portes: 58, vus: 24, closes: 17, telephones: 8, ventes: 4 },
    { date: '03/02/2024', portes: 41, vus: 17, closes: 11, telephones: 5, ventes: 2 },
    { date: '04/02/2024', portes: 63, vus: 26, closes: 19, telephones: 9, ventes: 5 },
    { date: '05/02/2024', portes: 39, vus: 15, closes: 10, telephones: 4, ventes: 1 },
    
    // Mars 2024
    { date: '01/03/2024', portes: 50, vus: 21, closes: 15, telephones: 7, ventes: 3 },
    { date: '02/03/2024', portes: 47, vus: 20, closes: 14, telephones: 6, ventes: 2 },
    { date: '03/03/2024', portes: 65, vus: 28, closes: 20, telephones: 10, ventes: 5 },
    { date: '04/03/2024', portes: 43, vus: 18, closes: 12, telephones: 5, ventes: 2 },
    { date: '05/03/2024', portes: 56, vus: 24, closes: 17, telephones: 8, ventes: 4 },
    
    // Avril 2024
    { date: '01/04/2024', portes: 44, vus: 19, closes: 13, telephones: 6, ventes: 3 },
    { date: '02/04/2024', portes: 51, vus: 22, closes: 16, telephones: 7, ventes: 3 },
    { date: '03/04/2024', portes: 48, vus: 20, closes: 14, telephones: 6, ventes: 2 },
    
    // Données 2023
    { date: '15/12/2023', portes: 40, vus: 16, closes: 11, telephones: 4, ventes: 1 },
    { date: '16/12/2023', portes: 45, vus: 19, closes: 13, telephones: 6, ventes: 2 },
    { date: '17/12/2023', portes: 52, vus: 22, closes: 15, telephones: 7, ventes: 3 },
    
    // Données 2025 (futures)
    { date: '10/01/2025', portes: 60, vus: 26, closes: 19, telephones: 9, ventes: 4 },
    { date: '11/01/2025', portes: 55, vus: 24, closes: 17, telephones: 8, ventes: 3 },
  ];

  const filters = [
    { id: 'yesterday', label: 'Hier' },
    { id: 'thisWeek', label: 'Cette semaine' },
    { id: 'lastWeek', label: 'Semaine dernière' },
    { id: 'thisMonth', label: 'Ce mois' },
    { id: 'thisYear', label: 'Cette année' },
  ];

  const months = [
    { id: '01', label: 'Janvier' },
    { id: '02', label: 'Février' },
    { id: '03', label: 'Mars' },
    { id: '04', label: 'Avril' },
    { id: '05', label: 'Mai' },
    { id: '06', label: 'Juin' },
    { id: '07', label: 'Juillet' },
    { id: '08', label: 'Août' },
    { id: '09', label: 'Septembre' },
    { id: '10', label: 'Octobre' },
    { id: '11', label: 'Novembre' },
    { id: '12', label: 'Décembre' },
  ];

  const years = ['2023', '2024', '2025'];

  const getFilteredData = () => {
    let filteredData = [...mockData];

    // Filtrage par mois et/ou année
    if (selectedMonth || selectedYear) {
      filteredData = mockData.filter(item => {
        const [day, month, year] = item.date.split('/');
        
        let matchesMonth = true;
        let matchesYear = true;
        
        if (selectedMonth) {
          matchesMonth = month === selectedMonth;
        }
        
        if (selectedYear) {
          matchesYear = year === selectedYear;
        }
        
        return matchesMonth && matchesYear;
      });
    }
    // Filtrage par période standard
    else {
      const today = new Date();
      const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
      const currentYear = today.getFullYear().toString();

      switch (selectedFilter) {
        case 'yesterday':
          // Simulation - prendre les 1 derniers jours
          filteredData = mockData.slice(-1);
          break;
        case 'thisWeek':
          // Simulation - prendre les 7 derniers jours
          filteredData = mockData.slice(-7);
          break;
        case 'lastWeek':
          // Simulation - prendre 7 jours avant les 7 derniers
          filteredData = mockData.slice(-14, -7);
          break;
        case 'thisMonth':
          filteredData = mockData.filter(item => {
            const [day, month, year] = item.date.split('/');
            return month === currentMonth && year === currentYear;
          });
          break;
        case 'thisYear':
          filteredData = mockData.filter(item => {
            const [day, month, year] = item.date.split('/');
            return year === currentYear;
          });
          break;
        default:
          filteredData = mockData.slice(-7);
      }
    }

    return filteredData;
  };

  const handleFilterSelect = (filter: FilterType) => {
    setSelectedFilter(filter);
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setSelectedFilter('thisWeek'); // Reset filter
    setSelectedYear(null);
    setShowMonthDropdown(false);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setSelectedFilter('thisWeek'); // Reset filter
    setSelectedMonth(null);
    setShowYearDropdown(false);
  };

  const getActiveFilterLabel = () => {
    if (selectedMonth && selectedYear) {
      const monthLabel = months.find(m => m.id === selectedMonth)?.label;
      return `${monthLabel} ${selectedYear}`;
    }
    if (selectedMonth && !selectedYear) {
      const monthLabel = months.find(m => m.id === selectedMonth)?.label;
      return `${monthLabel} (toutes années)`;
    }
    if (selectedYear && !selectedMonth) {
      return `Année ${selectedYear}`;
    }
    return filters.find(f => f.id === selectedFilter)?.label || 'Cette semaine';
  };

  const calculateTotals = (data: HistoryData[]) => {
    return data.reduce((acc, day) => ({
      portes: acc.portes + day.portes,
      vus: acc.vus + day.vus,
      closes: acc.closes + day.closes,
      telephones: acc.telephones + day.telephones,
      ventes: acc.ventes + day.ventes,
    }), { portes: 0, vus: 0, closes: 0, telephones: 0, ventes: 0 });
  };

  const calculateAverages = (data: HistoryData[]) => {
    const totals = calculateTotals(data);
    const days = data.length;
    return {
      portes: days > 0 ? (totals.portes / days).toFixed(1) : '0',
      vus: days > 0 ? (totals.vus / days).toFixed(1) : '0',
      closes: days > 0 ? (totals.closes / days).toFixed(1) : '0',
      telephones: days > 0 ? (totals.telephones / days).toFixed(1) : '0',
      ventes: days > 0 ? (totals.ventes / days).toFixed(1) : '0',
    };
  };

  const getBestDay = (data: HistoryData[]) => {
    if (data.length === 0) return null;
    return data.reduce((best, current) => 
      current.ventes > best.ventes ? current : best
    );
  };

  const prepareChartData = (data: HistoryData[]) => {
    if (data.length === 0) {
      return {
        labels: ['Aucune donnée'],
        datasets: [
          {
            data: [0],
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ['Aucune donnée'],
      };
    }

    return {
      labels: data.map(item => item.date.substring(0, 5)), // DD/MM format
      datasets: [
        {
          data: data.map(item => item.vus),
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: data.map(item => item.closes),
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: data.map(item => item.telephones),
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: data.map(item => item.ventes),
          color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Vus', 'Closes', 'Téléphones', 'Ventes'],
    };
  };

  const prepareBarChartData = (data: HistoryData[]) => {
    if (data.length === 0) {
      return {
        labels: ['Aucune donnée'],
        datasets: [
          {
            data: [0],
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          },
        ],
      };
    }

    return {
      labels: data.map(item => item.date.substring(0, 5)),
      datasets: [
        {
          data: data.map(item => item.ventes),
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#3B82F6',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
  };

  const filteredData = getFilteredData();
  const totals = calculateTotals(filteredData);
  const averages = calculateAverages(filteredData);
  const bestDay = getBestDay(filteredData);
  const chartData = prepareChartData(filteredData);
  const barChartData = prepareBarChartData(filteredData);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={24} color="#3B82F6" />
        <Text style={styles.title}>Historique</Text>
      </View>

      {/* Filtres par période */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersRow}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.id && !selectedMonth && !selectedYear && styles.filterButtonActive
                ]}
                onPress={() => handleFilterSelect(filter.id as FilterType)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && !selectedMonth && !selectedYear && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Filtres par mois et année */}
      <View style={styles.customFiltersContainer}>
        <Text style={styles.customFiltersTitle}>Filtres personnalisés</Text>
        <View style={styles.dropdownsRow}>
          {/* Dropdown Mois */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={[styles.dropdown, selectedMonth && styles.dropdownActive]}
              onPress={() => {
                setShowMonthDropdown(!showMonthDropdown);
                setShowYearDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, selectedMonth && styles.dropdownTextActive]}>
                {selectedMonth ? months.find(m => m.id === selectedMonth)?.label : 'Mois'}
              </Text>
              <ChevronDown size={16} color={selectedMonth ? '#FFFFFF' : '#6B7280'} />
            </TouchableOpacity>
            {showMonthDropdown && (
              <View style={styles.dropdownMenu}>
                <ScrollView style={styles.dropdownScroll}>
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month.id}
                      style={styles.dropdownItem}
                      onPress={() => handleMonthSelect(month.id)}
                    >
                      <Text style={styles.dropdownItemText}>{month.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Dropdown Année */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={[styles.dropdown, selectedYear && styles.dropdownActive]}
              onPress={() => {
                setShowYearDropdown(!showYearDropdown);
                setShowMonthDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, selectedYear && styles.dropdownTextActive]}>
                {selectedYear || 'Année'}
              </Text>
              <ChevronDown size={16} color={selectedYear ? '#FFFFFF' : '#6B7280'} />
            </TouchableOpacity>
            {showYearDropdown && (
              <View style={styles.dropdownMenu}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={styles.dropdownItem}
                    onPress={() => handleYearSelect(year)}
                  >
                    <Text style={styles.dropdownItemText}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Bouton Reset */}
          {(selectedMonth || selectedYear) && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedMonth(null);
                setSelectedYear(null);
                setSelectedFilter('thisWeek');
              }}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Indicateur de filtre actif */}
      <View style={styles.activeFilterContainer}>
        <Text style={styles.activeFilterText}>
          Période affichée: {getActiveFilterLabel()}
        </Text>
        <Text style={styles.dataCountText}>
          {filteredData.length} jour{filteredData.length > 1 ? 's' : ''} de données
        </Text>
      </View>

      {/* Sélecteur de type de graphique */}
      <View style={styles.chartTypeContainer}>
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            chartType === 'line' && styles.chartTypeButtonActive
          ]}
          onPress={() => setChartType('line')}
        >
          <LineChartIcon size={16} color={chartType === 'line' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[
            styles.chartTypeText,
            chartType === 'line' && styles.chartTypeTextActive
          ]}>
            Courbe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            chartType === 'bar' && styles.chartTypeButtonActive
          ]}
          onPress={() => setChartType('bar')}
        >
          <BarChart size={16} color={chartType === 'bar' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[
            styles.chartTypeText,
            chartType === 'bar' && styles.chartTypeTextActive
          ]}>
            Barres
          </Text>
        </TouchableOpacity>
      </View>

      {/* Graphique principal */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TrendingUp size={20} color="#3B82F6" />
          <Text style={styles.cardTitle}>Évolution des performances</Text>
        </View>
        
        {filteredData.length > 0 ? (
          <>
            {chartType === 'line' ? (
              <LineChart
                data={chartData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
              />
            ) : (
              <RNBarChart
                data={barChartData}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                }}
                style={styles.chart}
                showValuesOnTopOfBars={true}
              />
            )}
            
            {chartType === 'line' && (
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.legendText}>Vus</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#8B5CF6' }]} />
                  <Text style={styles.legendText}>Closes</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.legendText}>Téléphones</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.legendText}>Ventes</Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Aucune donnée disponible pour cette période</Text>
          </View>
        )}
      </View>

      {/* Totaux */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <BarChart size={20} color="#10B981" />
          <Text style={styles.cardTitle}>Totaux de la période</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totals.portes}</Text>
            <Text style={styles.statLabel}>Portes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totals.vus}</Text>
            <Text style={styles.statLabel}>Vus</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totals.closes}</Text>
            <Text style={styles.statLabel}>Closes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totals.telephones}</Text>
            <Text style={styles.statLabel}>Téléphones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totals.ventes}</Text>
            <Text style={styles.statLabel}>Ventes</Text>
          </View>
        </View>
      </View>

      {/* Moyennes */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Calendar size={20} color="#F59E0B" />
          <Text style={styles.cardTitle}>Moyennes journalières</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{averages.portes}</Text>
            <Text style={styles.statLabel}>Portes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{averages.vus}</Text>
            <Text style={styles.statLabel}>Vus</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{averages.closes}</Text>
            <Text style={styles.statLabel}>Closes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{averages.telephones}</Text>
            <Text style={styles.statLabel}>Téléphones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{averages.ventes}</Text>
            <Text style={styles.statLabel}>Ventes</Text>
          </View>
        </View>
      </View>

      {/* Meilleur jour */}
      {bestDay && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUp size={20} color="#10B981" />
            <Text style={styles.cardTitle}>Meilleur jour</Text>
          </View>
          <View style={styles.bestDayContainer}>
            <Text style={styles.bestDayDate}>{bestDay.date}</Text>
            <View style={styles.bestDayStats}>
              <Text style={styles.bestDayValue}>{bestDay.ventes} ventes</Text>
              <Text style={styles.bestDayDetail}>
                {bestDay.vus} vus • {bestDay.telephones} téléphones
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Détail par jour */}
      {filteredData.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Détail par jour</Text>
          <View style={styles.daysList}>
            {filteredData.map((day, index) => (
              <View key={index} style={styles.dayItem}>
                <Text style={styles.dayDate}>{day.date}</Text>
                <View style={styles.dayStats}>
                  <View style={styles.dayStatItem}>
                    <Text style={styles.dayStatValue}>{day.portes}</Text>
                    <Text style={styles.dayStatLabel}>P</Text>
                  </View>
                  <View style={styles.dayStatItem}>
                    <Text style={styles.dayStatValue}>{day.vus}</Text>
                    <Text style={styles.dayStatLabel}>V</Text>
                  </View>
                  <View style={styles.dayStatItem}>
                    <Text style={styles.dayStatValue}>{day.closes}</Text>
                    <Text style={styles.dayStatLabel}>C</Text>
                  </View>
                  <View style={styles.dayStatItem}>
                    <Text style={styles.dayStatValue}>{day.telephones}</Text>
                    <Text style={styles.dayStatLabel}>T</Text>
                  </View>
                  <View style={styles.dayStatItem}>
                    <Text style={[styles.dayStatValue, styles.ventesValue]}>{day.ventes}</Text>
                    <Text style={styles.dayStatLabel}>Ventes</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  customFiltersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  customFiltersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  dropdownsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'relative',
    flex: 1,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dropdownText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dropdownTextActive: {
    color: '#FFFFFF',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeFilterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  activeFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  dataCountText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  chartTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chartTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    gap: 4,
  },
  chartTypeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  chartTypeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  chartTypeTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  bestDayContainer: {
    alignItems: 'center',
    gap: 8,
  },
  bestDayDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  bestDayStats: {
    alignItems: 'center',
  },
  bestDayValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  bestDayDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  daysList: {
    gap: 12,
    marginTop: 16,
  },
  dayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  dayStats: {
    flexDirection: 'row',
    gap: 16,
  },
  dayStatItem: {
    alignItems: 'center',
  },
  dayStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dayStatLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  ventesValue: {
    color: '#10B981',
  },
});