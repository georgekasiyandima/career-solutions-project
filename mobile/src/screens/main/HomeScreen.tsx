import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Avatar,
  List,
  Divider,
  FAB,
} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation}: any) => {
  const {user} = useAuth();
  const {theme} = useTheme();

  const renderWelcomeCard = () => (
    <Card style={styles.welcomeCard}>
      <Card.Content>
        <View style={styles.welcomeHeader}>
          <Avatar.Text
            size={60}
            label={user?.name?.charAt(0) || 'U'}
            style={styles.avatar}
          />
          <View style={styles.welcomeText}>
            <Title>Welcome back, {user?.name || 'User'}!</Title>
            <Paragraph>Ready to advance your career?</Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderStatsCard = () => (
    <Card style={styles.statsCard}>
      <Card.Content>
        <Title style={styles.statsTitle}>Your Activity</Title>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Title style={styles.statNumber}>25</Title>
            <Paragraph style={styles.statLabel}>Available Jobs</Paragraph>
          </View>
          <View style={styles.statItem}>
            <Title style={styles.statNumber}>5</Title>
            <Paragraph style={styles.statLabel}>Saved Jobs</Paragraph>
          </View>
          <View style={styles.statItem}>
            <Title style={styles.statNumber}>3</Title>
            <Paragraph style={styles.statLabel}>Applications</Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderWelcomeCard()}
        {renderStatsCard()}
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Jobs')}
              style={styles.actionButton}>
              Browse Jobs
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Search')}
              style={styles.actionButton}>
              Search Jobs
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  statsCard: {
    marginBottom: 16,
    elevation: 4,
  },
  statsTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 4,
  },
  actionButton: {
    marginTop: 8,
  },
});

export default HomeScreen; 