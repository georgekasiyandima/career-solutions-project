import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
} from "@mui/material";
import { apiService } from "../../config/api";
import { formatDistanceToNow } from "date-fns";
import {
  TrendingUp,
  Work,
  Lightbulb,
  Announcement,
  Favorite,
  Share,
  Comment,
  Visibility,
  ArrowForward,
  EmojiEvents,
  PlayArrow,
  Pause,
  Schedule,
  Person,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const FeedCard = styled(Card)(({ theme, type }) => ({
  background: "rgba(255,255,255,0.98)",
  borderRadius: 16,
  overflow: "hidden",
  position: "relative",
  transition: "all 0.3s ease",
  border: "1px solid rgba(0, 0, 0, 0.04)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: type === 'motivation' ? `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})` :
               type === 'job' ? `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.dark})` :
               type === 'tip' ? `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})` :
               type === 'announcement' ? `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.dark})` :
               `linear-gradient(90deg, ${theme.palette.grey[500]}, ${theme.palette.grey[600]})`,
    zIndex: 1,
  },
}));

const IconContainer = styled(Box)(({ theme, type }) => ({
  width: 56,
  height: 56,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: type === 'motivation' ? `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})` :
              type === 'job' ? `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})` :
              type === 'tip' ? `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})` :
              type === 'announcement' ? `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})` :
              `linear-gradient(135deg, ${theme.palette.grey[500]}, ${theme.palette.grey[600]})`,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  marginRight: theme.spacing(2),
  animation: `${pulse} 3s infinite`,
}));

const EngagementBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 0),
  background: "rgba(0,0,0,0.02)",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.04)",
  marginTop: theme.spacing(2),
}));

const Feed = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getFeedPosts();
      // Transform backend data to match component structure
      const transformedPosts = response.data.map((post) => ({
        id: post.id,
        type: post.type || post.post_type || "announcement",
        title: post.title,
        content: post.content || post.description || "",
        author: post.author || post.created_by || "Career Solutions",
        timestamp: post.created_at,
        likes: post.likes || post.like_count || 0,
        comments: post.comments || post.comment_count || 0,
        views: post.views || post.view_count || 0,
        avatar: post.avatar || post.author_avatar || "/images/default-avatar.jpg",
      }));
      
      setPosts(transformedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      // Fallback to empty array if API fails
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Set up polling for live updates every 30 seconds
    const interval = setInterval(() => {
      fetchPosts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getPostIcon = (type) => {
    switch (type) {
      case 'motivation':
        return <EmojiEvents />;
      case 'job':
        return <Work />;
      case 'tip':
        return <Lightbulb />;
      case 'announcement':
        return <Announcement />;
      default:
        return <TrendingUp />;
    }
  };

  const getPostColor = (type) => {
    switch (type) {
      case 'motivation':
        return theme.palette.secondary.main;
      case 'job':
        return theme.palette.info.main;
      case 'tip':
        return theme.palette.warning.main;
      case 'announcement':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatTimeAgo = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
            <CircularProgress size={40} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchPosts}>
            Try Again
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.primary.main,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              fontFamily: '"Josefin Sans", sans-serif',
            }}
          >
            Latest Updates & Insights
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: "auto",
              fontSize: "1.1rem",
              fontFamily: '"Josefin Sans", sans-serif',
            }}
          >
            Stay informed with the latest job opportunities, career tips, and success stories
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {posts.length === 0 && !loading ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  No updates available at the moment. Check back soon!
                </Typography>
              </Box>
            </Grid>
          ) : (
            posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <FeedCard type={post.type}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <IconContainer type={post.type}>
                      {getPostIcon(post.type)}
                    </IconContainer>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: theme.palette.text.primary,
                          lineHeight: 1.3,
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.5,
                          mb: 2,
                        }}
                      >
                        {post.content}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={post.avatar}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    >
                      <Person />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                        {post.author}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: "block" }}>
                        {formatTimeAgo(post.timestamp)}
                      </Typography>
                    </Box>
                    <Chip
                      label={post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: `${getPostColor(post.type)}20`,
                        color: getPostColor(post.type),
                        fontWeight: 600,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>

                  <EngagementBar>
                    <IconButton
                      size="small"
                      onClick={() => handleLike(post.id)}
                      sx={{
                        color: likedPosts.has(post.id) ? theme.palette.error.main : theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.error.main,
                        },
                      }}
                    >
                      <Favorite fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </Typography>

                    <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                      <Comment fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {post.comments}
                    </Typography>

                    <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {post.views}
                    </Typography>

                    <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                      <Share fontSize="small" />
                    </IconButton>
                  </EngagementBar>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        background: "rgba(26, 95, 122, 0.08)",
                      },
                    }}
                  >
                    Read More
                  </Button>
                </CardActions>
              </FeedCard>
            </Grid>
          )))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              fontFamily: '"Josefin Sans", sans-serif',
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                background: "rgba(11, 68, 74, 0.08)",
              },
            }}
          >
            View All Updates
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Feed; 