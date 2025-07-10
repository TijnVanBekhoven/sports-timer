import * as Speech from 'expo-speech';
import {SpeechOptions} from "expo-speech";

const speechSettings: SpeechOptions = {
  language: 'nl-NL',
  rate: 0.8,
}

export const TextToSpeechService = {
  speak: (message: string) => Speech.speak(message, speechSettings),
  stopAll: () => Speech.stop(),
}
