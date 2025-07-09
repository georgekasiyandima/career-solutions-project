import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Searchbar,
  FAB,
  Menu,
  Divider,
  Text,
} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';
import {jobService, Job, JobFilters} from '../../services/jobService';

const JobsScreen = ({navigation}: any) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const {theme} = useTheme();

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setPage(1);
        setHasMore(true);
      }

      const currentPage = isRefresh ? 1 : page;
      const response = await jobService.getJobs(filters, currentPage, 10);

      if (isRefresh) {
        setJobs(response.jobs || []);
      } else {
        setJobs(prev => [...prev, ...(response.jobs || [])]);
      }

      setHasMore((response.jobs || []).length === 10);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs(true);
  };

  const onLoadMore = () => {
    if (hasMore && !loading) {
      loadJobs();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setFilters(prev => ({...prev, search: searchQuery.trim()}));
      setPage(1);
      setHasMore(true);
      loadJobs(true);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPage(1);
    setHasMore(true);
    loadJobs(true);
  };

  const renderJobCard = ({item}: {item: Job}) => (
    <Card style={styles.jobCard} onPress={() => navigation.navigate('JobDetails', {jobId: item.id})}>
      <Card.Content>
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Title style={styles.jobTitle}>{item.title}</Title>
            <Chip mode="outlined" compact style={styles.jobTypeChip}>
              {item.job_type}
            </Chip>
          </View>
        </View>

        <Paragraph style={styles.companyName}>{item.company}</Paragraph>
        <Paragraph style={styles.location}>{item.location}</Paragraph>

        <View style={styles.jobDetails}>
          <Chip mode="outlined" compact style={styles.detailChip}>
            {item.experience_level}
          </Chip>
          <Chip mode="outlined" compact style={styles.detailChip}>
            {item.salary_range}
          </Chip>
        </View>

        <Paragraph style={styles.description} numberOfLines={3}>
          {item.description}
        </Paragraph>

        <View style={styles.skillsContainer}>
          {item.skills.slice(0, 3).map((skill, index) => (
            <Chip key={index} mode="outlined" compact style={styles.skillChip}>
              {skill}
            </Chip>
          ))}
          {item.skills.length > 3 && (
            <Chip mode="outlined" compact style={styles.skillChip}>
              +{item.skills.length - 3} more
            </Chip>
          )}
        </View>

        <View style={styles.jobFooter}>
          <Text style={styles.deadline}>
            Deadline: {new Date(item.application_deadline).toLocaleDateString()}
          </Text>
          <Button mode="contained" compact>
            Apply Now
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderFilterMenu = () => (
    <Menu
      visible={filterMenuVisible}
      onDismiss={() => setFilterMenuVisible(false)}
      anchor={<Button icon="filter" onPress={() => setFilterMenuVisible(true)} />}>
      <Menu.Item
        onPress={() => {
          setFilters(prev => ({...prev, job_type: 'full-time'}));
          setFilterMenuVisible(false);
        }}
        title="Full Time"
      />
      <Menu.Item
        onPress={() => {
          setFilters(prev => ({...prev, job_type: 'part-time'}));
          setFilterMenuVisible(false);
        }}
        title="Part Time"
      />
      <Menu.Item
        onPress={() => {
          setFilters(prev => ({...prev, job_type: 'contract'}));
          setFilterMenuVisible(false);
        }}
        title="Contract"
      />
      <Divider />
      <Menu.Item
        onPress={() => {
          setFilters(prev => ({...prev, experience_level: 'entry'}));
          setFilterMenuVisible(false);
        }}
        title="Entry Level"
      />
      <Menu.Item
        onPress={() => {
          setFilters(prev => ({...prev, experience_level: 'mid'}));
          setFilterMenuVisible(false);
        }}
        title="Mid Level"
      />
      <Menu.Item
        onPress={() => {
          setFilters(prev => ({...prev, experience_level: 'senior'}));
          setFilterMenuVisible(false);
        }}
        title="Senior Level"
      />
    </Menu>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No jobs found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search criteria or filters
      </Text>
      <Button mode="contained" onPress={clearFilters} style={styles.clearButton}>
        Clear Filters
      </Button>
    </View>
  );

  if (loading && jobs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search jobs..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
        />
        <Button
          icon="filter"
          mode="outlined"
          onPress={() => setFilterMenuVisible(true)}
          style={styles.filterButton}>
          Filters
        </Button>
      </View>

      {Object.keys(filters).length > 0 && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
          <View style={styles.filterChips}>
            {Object.entries(filters).map(([key, value]) => (
              <Chip
                key={key}
                mode="outlined"
                onClose={() => {
                  const newFilters = {...filters};
                  delete newFilters[key as keyof JobFilters];
                  setFilters(newFilters);
                }}
                style={styles.filterChip}>
                {key}: {value}
              </Chip>
            ))}
          </View>
          <Button mode="text" onPress={clearFilters} compact>
            Clear All
          </Button>
        </View>
      )}

      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          hasMore && jobs.length > 0 ? (
            <ActivityIndicator style={styles.loadingMore} />
          ) : null
        }
      />

      {renderFilterMenu()}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Search')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    alignSelf: 'center',
  },
  activeFilters: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  activeFiltersTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  jobTypeChip: {
    alignSelf: 'flex-start',
  },
  companyName: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  location: {
    color: '#666',
    marginBottom: 8,
  },
  jobDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailChip: {
    marginRight: 8,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  skillChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadline: {
    color: '#666',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  clearButton: {
    marginTop: 8,
  },
  loadingMore: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default JobsScreen; 