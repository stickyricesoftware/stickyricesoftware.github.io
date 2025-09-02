// components/StoriesBar.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Linking, // ⚠️ Add Linking import here
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Correct import
import { useTheme } from "@react-navigation/native";
import { styles } from "../styles"; // Import your universal style sheet

const WORDPRESS_URL =
  "https://fpltoolbox.com/wp-json/wp/v2/posts?per_page=8&_embed";

export default function StoriesBar() {
  const [posts, setPosts] = useState([]);
  const [viewedStories, setViewedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { colors } = useTheme();

  useEffect(() => {
    async function getStoredDataAndFetchPosts() {
      try {
        const storedViewed = await AsyncStorage.getItem("viewedFplStories");
        if (storedViewed) {
          setViewedStories(JSON.parse(storedViewed));
        }
        await fetchPosts();
      } catch (err) {
        console.error("AsyncStorage or fetch error:", err);
        setError("Could not load stories.");
        setLoading(false);
      }
    }
    getStoredDataAndFetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(WORDPRESS_URL);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching WordPress posts:", err);
      setError("Could not load stories.");
    } finally {
      setLoading(false);
    }
  };

  const handleStoryPress = async (postId, postLink) => {
    // Open the URL in the phone's browser
    Linking.openURL(postLink);

    if (!viewedStories.includes(postId)) {
      const updated = [...viewedStories, postId];
      setViewedStories(updated);
      try {
        await AsyncStorage.setItem("viewedFplStories", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save viewed stories:", e);
      }
    }
  };

  if (loading) {
    return (
      <View style={localStyles.statusContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[localStyles.statusText, { color: colors.onBackground }]}>
          Loading stories...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={localStyles.statusContainer}>
        <Text style={[localStyles.statusText, { color: colors.error }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={localStyles.statusContainer}>
        <Text style={[localStyles.statusText, { color: colors.onBackground }]}>
          No recent blog posts found.
        </Text>
      </View>
    );
  }

  return (
    <View style={[localStyles.storiesContainer, { borderColor: colors.outline }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {posts.map((post) => {
          const featuredImage =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          const isViewed = viewedStories.includes(post.id);

          return (
            <Pressable
              key={post.id}
              style={localStyles.storyItem}
              onPress={() => handleStoryPress(post.id, post.link)}
            >
              <View
                style={[
                  localStyles.storyRing,
                  {
                    borderColor: isViewed ? colors.outline : "#EE5454",
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <View
                  style={[
                    localStyles.storyImageContainer,
                    {
                      borderColor: colors.surface,
                    },
                  ]}
                >
                  <Image
                    source={
                      featuredImage
                        ? { uri: featuredImage }
                        : require("../assets/icon.png") // Fallback image
                    }
                    style={localStyles.storyImage}
                  />
                </View>
              </View>
              <Text
                style={[localStyles.storyText, { color: colors.onSurfaceVariant }]}
                numberOfLines={1}
              >
                {post.title.rendered.replace(/<\/?p>/g, "")}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  storiesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  statusContainer: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  statusText: {
    marginLeft: 10,
  },
  storyItem: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 80,
  },
  storyRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  storyImageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    borderWidth: 2.5,
    overflow: "hidden", // Ensures the image is clipped to the circle
  },
  storyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  storyText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
  },
});