import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePreferences } from "@/contexts/PreferencesContext";

import Colors from "@/constants/colors";
import { GENRES, THEMES, VIBES } from "@/constants/book";

interface Question {
  id: string;
  question: string;
  type: "multiple" | "single";
  options: readonly string[];
  key: keyof QuestionAnswers;
}

interface QuestionAnswers {
  genres: string[];
  vibes: string[];
  themes: string[];
  pacePreference: string;
  lengthPreference: string;
}

const QUESTIONS: Question[] = [
  {
    id: "1",
    question: "What genres make your heart flutter?",
    type: "multiple",
    options: GENRES,
    key: "genres",
  },
  {
    id: "2",
    question: "What vibes are you looking for?",
    type: "multiple",
    options: VIBES,
    key: "vibes",
  },
  {
    id: "3",
    question: "What themes speak to you?",
    type: "multiple",
    options: THEMES,
    key: "themes",
  },
  {
    id: "4",
    question: "What's your reading pace preference?",
    type: "single",
    options: ["Slow burn", "Fast-paced", "I like variety"],
    key: "pacePreference",
  },
  {
    id: "5",
    question: "How long should your perfect book be?",
    type: "single",
    options: ["Short & sweet (< 300 pages)", "Medium (300-450 pages)", "Epic (> 450 pages)", "Length doesn't matter"],
    key: "lengthPreference",
  },
];

export default function QuestionsScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { setPreferences } = usePreferences();
  const [answers, setAnswers] = useState<QuestionAnswers>({
    genres: [],
    vibes: [],
    themes: [],
    pacePreference: "",
    lengthPreference: "",
  });

  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const question = QUESTIONS[currentQuestion];

  const handleSelect = (option: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (question.type === "multiple") {
      const currentAnswers = answers[question.key] as string[];
      const isSelected = currentAnswers.includes(option);
      
      setAnswers({
        ...answers,
        [question.key]: isSelected
          ? currentAnswers.filter((a) => a !== option)
          : [...currentAnswers, option],
      });
    } else {
      setAnswers({
        ...answers,
        [question.key]: option,
      });
    }
  };

  const isSelected = (option: string): boolean => {
    const answer = answers[question.key];
    if (Array.isArray(answer)) {
      return answer.includes(option);
    }
    return answer === option;
  };

  const canProceed = (): boolean => {
    const answer = answers[question.key];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== "";
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentQuestion < QUESTIONS.length - 1) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentQuestion(currentQuestion + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setPreferences(answers);
        router.replace("/discover");
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentQuestion > 0) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentQuestion(currentQuestion - 1);
    } else {
      router.back();
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={28} color={Colors.light.primary} />
          </Pressable>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {currentQuestion + 1} / {QUESTIONS.length}
            </Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.content,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Text style={styles.question}>{question.question}</Text>
          <Text style={styles.hint}>
            {question.type === "multiple" ? "Select all that apply" : "Choose one"}
          </Text>

          <ScrollView
            style={styles.optionsContainer}
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={false}
          >
            {question.options.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.option,
                  isSelected(option) && styles.optionSelected,
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected(option) && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.nextButton,
              !canProceed() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestion === QUESTIONS.length - 1 ? "Find My Books" : "Next"}
            </Text>
            <ChevronRight size={24} color={Colors.light.background} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  progressContainer: {
    flex: 1,
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "600" as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  question: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    marginBottom: 8,
    lineHeight: 38,
  },
  hint: {
    fontSize: 16,
    color: Colors.light.secondary,
    marginBottom: 32,
    fontWeight: "500" as const,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsContent: {
    gap: 12,
    paddingBottom: 20,
  },
  option: {
    backgroundColor: Colors.light.card,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  optionSelected: {
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.primary,
  },
  optionText: {
    fontSize: 17,
    color: Colors.light.text,
    fontWeight: "500" as const,
  },
  optionTextSelected: {
    color: Colors.light.primary,
    fontWeight: "700" as const,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  nextButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.light.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "700" as const,
  },
});
