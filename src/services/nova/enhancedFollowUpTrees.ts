
import { VenueTag } from '../../hooks/notifications/types';

export interface FollowUpBranch {
  key: string;
  label: string;
  aiResponse: string;
  venueFilterTags?: VenueTag[];
  nextStep?: FollowUpNode;
}

export interface FollowUpNode {
  userIntent: string;
  clarifyingQuestions: string[];
  branches: FollowUpBranch[];
}

/**
 * Enhanced follow-up trees with better structure and type safety
 */
export const enhancedFollowUpTrees: Record<string, FollowUpNode> = {
  "fun night": {
    userIntent: "fun night",
    clarifyingQuestions: [
      "What kind of fun are you looking for tonight?"
    ],
    branches: [
      {
        key: "dancing",
        label: "Dancing & Music",
        aiResponse: "Perfect! Here are the hottest spots with DJs and dance floors:",
        venueFilterTags: ["music", "dancing", "high_energy"]
      },
      {
        key: "surprises",
        label: "Something Unexpected",
        aiResponse: "I love that! Check out these unique spots with surprise elements:",
        venueFilterTags: ["unique", "pop_up", "speakeasy"]
      },
      {
        key: "energy",
        label: "High Energy Scene",
        aiResponse: "You want the buzz! These places are electric tonight:",
        venueFilterTags: ["high_energy", "trending"]
      }
    ]
  },

  "date night": {
    userIntent: "date night",
    clarifyingQuestions: [
      "What's the vibe you're going for?"
    ],
    branches: [
      {
        key: "romantic-dinner",
        label: "Romantic Dinner",
        aiResponse: "Here are intimate spots perfect for a romantic evening:",
        venueFilterTags: ["romantic", "restaurants", "upscale"]
      },
      {
        key: "fun-activity",
        label: "Fun Activity",
        aiResponse: "These places offer great date activities and atmosphere:",
        venueFilterTags: ["activity", "live music", "casual"],
        nextStep: {
          userIntent: "activity-type",
          clarifyingQuestions: ["What kind of activity sounds good?"],
          branches: [
            {
              key: "live-music",
              label: "Live Music",
              aiResponse: "Perfect choice! These venues have live performances tonight:",
              venueFilterTags: ["live music", "romantic"]
            },
            {
              key: "interactive",
              label: "Interactive Fun",
              aiResponse: "Great for breaking the ice! Try these interactive spots:",
              venueFilterTags: ["activity", "unique"]
            }
          ]
        }
      },
      {
        key: "rooftop-drinks",
        label: "Rooftop Drinks",
        aiResponse: "Romantic views and great cocktails - here are the best rooftops:",
        venueFilterTags: ["rooftop", "scenic", "romantic"]
      }
    ]
  },

  "chill vibes": {
    userIntent: "chill vibes",
    clarifyingQuestions: [
      "What kind of chill atmosphere are you after?"
    ],
    branches: [
      {
        key: "cozy-lounge",
        label: "Cozy Lounge",
        aiResponse: "These lounges have the perfect relaxed atmosphere:",
        venueFilterTags: ["lounge", "quiet", "casual"]
      },
      {
        key: "rooftop-chill",
        label: "Scenic Rooftop",
        aiResponse: "Unwind with great views at these chill rooftops:",
        venueFilterTags: ["rooftop", "scenic", "quiet"]
      },
      {
        key: "hidden-gem",
        label: "Hidden Gem",
        aiResponse: "I know some secret spots perfect for a relaxed night:",
        venueFilterTags: ["hidden", "quiet", "unique"]
      }
    ]
  },

  "surprise me": {
    userIntent: "surprise me",
    clarifyingQuestions: [
      "What kind of surprise sounds exciting?"
    ],
    branches: [
      {
        key: "trending",
        label: "What's Hot Right Now",
        aiResponse: "These are the hottest venues everyone's talking about:",
        venueFilterTags: ["trending", "new"]
      },
      {
        key: "hidden-gems",
        label: "Secret Hidden Gems",
        aiResponse: "Let me show you some amazing places most people don't know about:",
        venueFilterTags: ["hidden", "unique"]
      },
      {
        key: "themed-experience",
        label: "Unique Themed Experience",
        aiResponse: "These themed venues will blow your mind:",
        venueFilterTags: ["themed", "immersive", "unique"]
      }
    ]
  }
};
