import React, { useState } from "react";
import { View, ScrollView, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import * as MailComposer from "expo-mail-composer";
import { toast } from "sonner-native";
import { EMAIL_RECIPIENTS } from "~/lib/constants";

const FreiScreen = () => {
  // Set default date to day after tomorrow
  const getMinimumDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // Day after tomorrow (3 days)
    return date;
  };

  // Set default times to 7:00 and 17:00
  const getDefaultStartTime = () => {
    const time = new Date();
    time.setHours(7, 0, 0, 0);
    return time;
  };

  const getDefaultEndTime = () => {
    const time = new Date();
    time.setHours(17, 0, 0, 0);
    return time;
  };

  const [date, setDate] = useState(getMinimumDate());
  const [startTime, setStartTime] = useState(getDefaultStartTime());
  const [endTime, setEndTime] = useState(getDefaultEndTime());
  const [reason, setReason] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE");
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Helper function to enforce time range (7:00-17:00)
  const enforceTimeRange = (time: Date) => {
    const hours = time.getHours();
    const newTime = new Date(time);

    if (hours < 7) {
      newTime.setHours(7, 0, 0, 0);
    } else if (hours > 17) {
      newTime.setHours(17, 0, 0, 0);
    } else if (hours === 17 && time.getMinutes() > 0) {
      newTime.setHours(17, 0, 0, 0);
    }

    return newTime;
  };

  const resetForm = () => {
    setDate(getMinimumDate());
    setStartTime(getDefaultStartTime());
    setEndTime(getDefaultEndTime());
    setReason("");
  };

  const validateForm = () => {
    if (!reason.trim()) {
      Alert.alert("Fehler", "Bitte geben Sie einen Grund ein.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Fehler", "E-Mail-App ist nicht verfügbar.");
        return;
      }

      const emailBody = `
Abwesenheitsantrag

Datum: ${formatDate(date)}
Von: ${formatTime(startTime)} bis ${formatTime(endTime)}

Grund: ${reason}

Gesendet am: ${new Date().toLocaleDateString("de-DE")}
      `.trim();

      const result = await MailComposer.composeAsync({
        recipients: EMAIL_RECIPIENTS,
        subject: `Abwesenheit - ${formatDate(date)}`,
        body: emailBody,
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        toast.success("Gesendet!", {
          description: "Abwesenheit wurde gemeldet.",
        });
        resetForm();
      }
    } catch (error) {
      Alert.alert("Fehler", "Beim Senden ist ein Fehler aufgetreten.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <View className="mb-8 mt-8 items-center">
          <Text className="text-3xl font-bold text-red-500">
            Abwesenheit melden
          </Text>
        </View>

        {/* Date */}
        <Text className="text-lg font-semibold mb-2">Datum</Text>
        <Button onPress={() => setShowDatePicker(true)} variant="outline">
          <Text>{formatDate(date)}</Text>
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            minimumDate={getMinimumDate()}
            maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === "ios");
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Start Time */}
        <Text className="text-lg font-semibold mb-2">Von</Text>
        <Button onPress={() => setShowStartTimePicker(true)} variant="outline">
          <Text>{formatTime(startTime)}</Text>
        </Button>

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            is24Hour={true}
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(Platform.OS === "ios");
              if (selectedTime) {
                const validTime = enforceTimeRange(selectedTime);
                setStartTime(validTime);

                // Show alert if time was outside range
                const hours = selectedTime.getHours();
                if (
                  hours < 7 ||
                  hours > 17 ||
                  (hours === 17 && selectedTime.getMinutes() > 0)
                ) {
                  Alert.alert(
                    "Zeit angepasst",
                    "Arbeitszeiten sind von 7:00 bis 17:00 Uhr."
                  );
                }
              }
            }}
          />
        )}

        {/* End Time */}
        <Text className="text-lg font-semibold mb-2">Bis</Text>
        <Button onPress={() => setShowEndTimePicker(true)} variant="outline">
          <Text>{formatTime(endTime)}</Text>
        </Button>

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            is24Hour={true}
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(Platform.OS === "ios");
              if (selectedTime) {
                const validTime = enforceTimeRange(selectedTime);
                setEndTime(validTime);

                // Show alert if time was outside range
                const hours = selectedTime.getHours();
                if (
                  hours < 7 ||
                  hours > 17 ||
                  (hours === 17 && selectedTime.getMinutes() > 0)
                ) {
                  Alert.alert(
                    "Zeit angepasst",
                    "Arbeitszeiten sind von 7:00 bis 17:00 Uhr."
                  );
                }
              }
            }}
          />
        )}

        {/* Reason */}
        <Text className="text-lg font-semibold mb-2">Grund</Text>
        <Textarea
          value={reason}
          onChangeText={setReason}
          placeholder="Warum sind Sie abwesend?"
          numberOfLines={3}
        />

        {/* Submit */}
        <Button onPress={handleSubmit} className="bg-red-500 mb-8 mt-8">
          <Text className="text-foreground">Senden</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default FreiScreen;
