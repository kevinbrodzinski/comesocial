
export interface FollowUpNode {
  /**
   * The key intent that triggers this follow-up
   */
  userIntent: string;
  /**
   * Questions to clarify vague requests
   */
  clarifyingQuestions: string[];
  /**
   * Mapping from user reply to next response and optional next-step
   */
  responseBranches: Record<
    string,
    {
      aiResponse: string;
      venueFilterTags?: string[];
      nextStep?: FollowUpNode;
    }
  >;
}

/**
 * Starter follow-up trees for Nova AI to handle vague or emotional intents
 */
export const followUpTrees: Record<string, FollowUpNode> = {
  "fun night": {
    userIntent: "fun night",
    clarifyingQuestions: [
      "Fun like dancing or fun like surprises?"
    ],
    responseBranches: {
      "dancing": {
        aiResponse: "Great choice! Here are spots with live DJs and dance floors tonight:",
        venueFilterTags: ["music", "dancing", "high_energy"]
      },
      "surprises": {
        aiResponse: "I love surprises! Check out these unique pop-up events and secret bars:",
        venueFilterTags: ["unique", "pop_up", "speakeasy"]
      }
    }
  },

  "adventurous": {
    userIntent: "adventurous",
    clarifyingQuestions: [
      "Want something brand new or a hidden gem?"
    ],
    responseBranches: {
      "brand new": {
        aiResponse: "These are the newest venues in town that just opened:",
        venueFilterTags: ["new"]
      },
      "hidden gem": {
        aiResponse: "I found these under-the-radar spots perfect for an adventure:",
        venueFilterTags: ["hidden", "unique"]
      }
    }
  },

  "date night": {
    userIntent: "date night",
    clarifyingQuestions: [
      "Romantic dinner or fun activity?"
    ],
    responseBranches: {
      "dinner": {
        aiResponse: "Here are intimate restaurants and cocktail lounges for a romantic dinner:",
        venueFilterTags: ["romantic", "restaurants"]
      },
      "activity": {
        aiResponse: "How about these fun date activities and lounges with live music:",
        venueFilterTags: ["activity", "live music"]
      }
    }
  },

  "chill vibes": {
    userIntent: "chill vibes",
    clarifyingQuestions: [
      "Cozy lounge or scenic rooftop?"
    ],
    responseBranches: {
      "cozy lounge": {
        aiResponse: "These lounges have the perfect chill atmosphere:",
        venueFilterTags: ["lounge", "quiet"]
      },
      "rooftop": {
        aiResponse: "Check out these rooftops with great views and relaxed vibes:",
        venueFilterTags: ["rooftop", "scenic"]
      }
    }
  },

  "foodie": {
    userIntent: "foodie",
    clarifyingQuestions: [
      "Casual eats or upscale dining?"
    ],
    responseBranches: {
      "casual": {
        aiResponse: "Great picks! Here are casual spots with delicious menus:",
        venueFilterTags: ["gastropub", "casual"]
      },
      "upscale": {
        aiResponse: "For a special night, try these upscale restaurants:",
        venueFilterTags: ["upscale", "fine dining"]
      }
    }
  },

  "music lover": {
    userIntent: "music lover",
    clarifyingQuestions: [
      "Live band or DJ set tonight?"
    ],
    responseBranches: {
      "live band": {
        aiResponse: "These venues have live bands playing tonight:",
        venueFilterTags: ["live music"]
      },
      "dj set": {
        aiResponse: "Here are the best DJ sets happening tonight:",
        venueFilterTags: ["dj", "dance"]
      }
    }
  },

  "budget night": {
    userIntent: "budget night",
    clarifyingQuestions: [
      "Happy hour specials or free entry events?"
    ],
    responseBranches: {
      "happy hour": {
        aiResponse: "These spots have great happy hour deals:",
        venueFilterTags: ["happy hour", "deals"]
      },
      "free entry": {
        aiResponse: "Check out these free-entry events tonight:",
        venueFilterTags: ["free entry", "events"]
      }
    }
  },

  "unique experience": {
    userIntent: "unique experience",
    clarifyingQuestions: [
      "Fancy something immersive or themed?"
    ],
    responseBranches: {
      "immersive": {
        aiResponse: "Dive into these immersive venue experiences:",
        venueFilterTags: ["immersive"]
      },
      "themed": {
        aiResponse: "These themed bars and pop-ups are really one-of-a-kind:",
        venueFilterTags: ["themed"]
      }
    }
  },

  "surprise me": {
    userIntent: "surprise me",
    clarifyingQuestions: [
      "Do you want trending spots or hidden gems?"
    ],
    responseBranches: {
      "trending spots": {
        aiResponse: "These are the hottest venues right now:",
        venueFilterTags: ["trending"]
      },
      "hidden gems": {
        aiResponse: "Let me show you some underrated gems:",
        venueFilterTags: ["hidden"]
      }
    }
  }
};
