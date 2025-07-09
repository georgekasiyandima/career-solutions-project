import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Share,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
  List,
  FAB,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';
import {jobService, Job} from '../../services/jobService';

const JobDetailsScreen = ({route, navigation}: any) => {
  const {jobId} = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);

  const {user} = useAuth();
  const {theme} = useTheme();

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const jobData = await jobService.getJob(jobId);
      setJob(jobData);
    } catch (error) {
      console.error('Error loading job details:', error);
      Alert.alert('Error', 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to apply for this job');
      return;
    }

    Alert.alert(
      'Apply for Job',
      `Are you sure you want to apply for ${job?.title} at ${job?.company}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Apply',
          onPress: async () => {
            try {
              setApplying(true);
              await jobService.applyForJob(jobId, {
                job_id: jobId,
                cover_letter: '',
              });
              Alert.alert('Success', 'Your application has been submitted!');
            } catch (error) {
              Alert.alert('Error', 'Failed to submit application');
            } finally {
              setApplying(false);
            }
          },
        },
      ]
    );
  };

  const handleSaveJob = async () => {
    try {
      if (saved) {
        await jobService.unsaveJob(jobId);
        setSaved(false);
      } else {
        await jobService.saveJob(jobId);
        setSaved(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update saved status');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job opportunity: ${job?.title} at ${job?.company}`,
        title: job?.title,
      });
    } catch (error) {
      console.error('Error sharing job:', error);
    }
  };

  const handleContact = () => {
    if (job?.contact_email) {
      Linking.openURL(`mailto:${job.contact_email}`);
    }
  };

  const handleCall = () => {
    if (job?.contact_phone) {
      Linking.openURL(`tel:${job.contact_phone}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Job not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Job Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.jobHeader}>
              <View style={styles.jobTitleContainer}>
                <Title style={styles.jobTitle}>{job.title}</Title>
                <Text style={styles.companyName}>{job.company}</Text>
                <Text style={styles.location}>{job.location}</Text>
              </View>
              <View style={styles.jobBadges}>
                <Chip mode="outlined" style={styles.badge}>
                  {job.job_type}
                </Chip>
                <Chip mode="outlined" style={styles.badge}>
                  {job.experience_level}
                </Chip>
              </View>
            </View>

            <View style={styles.salaryContainer}>
              <Text style={styles.salaryLabel}>Salary Range:</Text>
              <Text style={styles.salary}>{job.salary_range}</Text>
            </View>

            <View style={styles.deadlineContainer}>
              <Text style={styles.deadlineLabel}>Application Deadline:</Text>
              <Text style={styles.deadline}>
                {new Date(job.application_deadline).toLocaleDateString()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Job Description */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Job Description</Title>
            <Paragraph style={styles.description}>{job.description}</Paragraph>
          </Card.Content>
        </Card>

        {/* Requirements */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Requirements</Title>
            <Paragraph style={styles.requirements}>{job.requirements}</Paragraph>
          </Card.Content>
        </Card>

        {/* Skills */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Required Skills</Title>
            <View style={styles.skillsContainer}>
              {job.skills.map((skill, index) => (
                <Chip key={index} mode="outlined" style={styles.skillChip}>
                  {skill}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Benefits</Title>
              {job.benefits.map((benefit, index) => (
                <List.Item
                  key={index}
                  title={benefit}
                  left={(props) => <List.Icon {...props} icon="check" />}
                  style={styles.benefitItem}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Contact Information */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Contact Information</Title>
            {job.contact_email && (
              <List.Item
                title="Email"
                description={job.contact_email}
                left={(props) => <List.Icon {...props} icon="email" />}
                onPress={handleContact}
                style={styles.contactItem}
              />
            )}
            {job.contact_phone && (
              <List.Item
                title="Phone"
                description={job.contact_phone}
                left={(props) => <List.Icon {...props} icon="phone" />}
                onPress={handleCall}
                style={styles.contactItem}
              />
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleApply}
            loading={applying}
            disabled={applying}
            style={styles.applyButton}
            icon="send">
            Apply Now
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleSaveJob}
            style={styles.saveButton}
            icon={saved ? 'bookmark' : 'bookmark-outline'}>
            {saved ? 'Saved' : 'Save Job'}
          </Button>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="share"
        onPress={handleShare}
        label="Share"
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
  },
  jobHeader: {
    marginBottom: 16,
  },
  jobTitleContainer: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  jobBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    marginRight: 8,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  salaryLabel: {
    fontWeight: '600',
    marginRight: 8,
  },
  salary: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineLabel: {
    fontWeight: '600',
    marginRight: 8,
  },
  deadline: {
    fontSize: 14,
    color: '#FF9800',
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
  description: {
    lineHeight: 24,
    fontSize: 16,
  },
  requirements: {
    lineHeight: 24,
    fontSize: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    marginBottom: 8,
  },
  benefitItem: {
    paddingVertical: 4,
  },
  contactItem: {
    paddingVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  applyButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default JobDetailsScreen; 