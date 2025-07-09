import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Text,
  List,
  Divider,
  FAB,
} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';
import {jobService, Job} from '../../services/jobService';

interface SearchResult {
  id: number;
  type: 'job' | 'content' | 'resource';
  title: string;
  description: string;
  data: any;
}

const SearchScreen = ({navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'jobs' | 'content'>('all');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    experienceLevel: '',
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const searchBarRef = useRef<any>(null);
  const {theme} = useTheme();

  useEffect(() => {
    loadRecentSearches();
    loadSuggestions();
  }, []);

  const loadRecentSearches = async () => {
    // Load from AsyncStorage in a real app
    setRecentSearches(['Software Engineer', 'React Native', 'Remote Jobs']);
  };

  const loadSuggestions = async () => {
    // Load search suggestions from API
    setSuggestions([
      'Software Developer',
      'Data Analyst',
      'Product Manager',
      'UX Designer',
      'Marketing Specialist',
    ]);
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      let searchResults: SearchResult[] = [];

      if (searchType === 'all' || searchType === 'jobs') {
        const jobsResponse = await jobService.searchJobs(query, filters);
        const jobResults = (jobsResponse.jobs || []).map((job: Job) => ({
          id: job.id,
          type: 'job' as const,
          title: job.title,
          description: `${job.company} • ${job.location}`,
          data: job,
        }));
        searchResults.push(...jobResults);
      }

      // Add content search results here
      // const contentResponse = await contentService.search(query);
      // const contentResults = contentResponse.map(content => ({
      //   id: content.id,
      //   type: 'content',
      //   title: content.title,
      //   description: content.excerpt,
      //   data: content,
      // }));
      // searchResults.push(...contentResults);

      setResults(searchResults);
      addToRecentSearches(query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentSearches = (query: string) => {
    const newSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newSearches);
    // Save to AsyncStorage in a real app
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    performSearch(searchQuery);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    performSearch(suggestion);
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    performSearch(search);
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'job') {
      navigation.navigate('JobDetails', {jobId: result.id});
    } else if (result.type === 'content') {
      navigation.navigate('Content', {contentId: result.id});
    }
  };

  const renderSearchResult = ({item}: {item: SearchResult}) => (
    <Card style={styles.resultCard} onPress={() => handleResultPress(item)}>
      <Card.Content>
        <View style={styles.resultHeader}>
          <Title style={styles.resultTitle}>{item.title}</Title>
          <Chip mode="outlined" compact style={styles.resultTypeChip}>
            {item.type.toUpperCase()}
          </Chip>
        </View>
        <Paragraph style={styles.resultDescription}>{item.description}</Paragraph>
        {item.type === 'job' && (
          <View style={styles.jobDetails}>
            <Chip mode="outlined" compact style={styles.jobChip}>
              {item.data.job_type}
            </Chip>
            <Chip mode="outlined" compact style={styles.jobChip}>
              {item.data.experience_level}
            </Chip>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderRecentSearches = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Recent Searches</Title>
        {recentSearches.map((search, index) => (
          <List.Item
            key={index}
            title={search}
            left={(props) => <List.Icon {...props} icon="history" />}
            onPress={() => handleRecentSearchPress(search)}
            style={styles.recentItem}
          />
        ))}
      </Card.Content>
    </Card>
  );

  const renderSuggestions = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Popular Searches</Title>
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <Chip
              key={index}
              mode="outlined"
              onPress={() => handleSuggestionPress(suggestion)}
              style={styles.suggestionChip}>
              {suggestion}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderFilters = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Search Filters</Title>
        <View style={styles.filterButtons}>
          <Button
            mode={searchType === 'all' ? 'contained' : 'outlined'}
            onPress={() => setSearchType('all')}
            style={styles.filterButton}>
            All
          </Button>
          <Button
            mode={searchType === 'jobs' ? 'contained' : 'outlined'}
            onPress={() => setSearchType('jobs')}
            style={styles.filterButton}>
            Jobs
          </Button>
          <Button
            mode={searchType === 'content' ? 'contained' : 'outlined'}
            onPress={() => setSearchType('content')}
            style={styles.filterButton}>
            Content
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No results found' : 'Start your search'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try adjusting your search terms or filters'
          : 'Search for jobs, articles, and resources'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          ref={searchBarRef}
          placeholder="Search jobs, content, resources..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          onIconPress={handleSearch}
          style={styles.searchBar}
        />
      </View>

      {!searchQuery && !loading && results.length === 0 ? (
        <ScrollView style={styles.scrollView}>
          {renderFilters()}
          {renderRecentSearches()}
          {renderSuggestions()}
        </ScrollView>
      ) : (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={
            loading ? (
              <ActivityIndicator style={styles.loadingIndicator} />
            ) : null
          }
        />
      )}

      <FAB
        style={styles.fab}
        icon="filter"
        onPress={() => navigation.navigate('AdvancedSearch')}
        label="Advanced"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
  },
  scrollView: {
    flex: 1,
  },
  sectionCard: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentItem: {
    paddingVertical: 8,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  resultCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultTypeChip: {
    marginLeft: 8,
  },
  resultDescription: {
    marginBottom: 8,
    color: '#666',
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  jobChip: {
    marginRight: 8,
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
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  loadingIndicator: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default SearchScreen; 