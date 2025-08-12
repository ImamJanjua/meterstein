import React, { useState } from "react";
import { View, Platform, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const FreiScreen = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  console.log("showDatePicker", showDatePicker);
  console.log("showTimePicker", showTimePicker);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === "ios");
    setTime(currentTime);
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const showTimePickerHandler = () => {
    setShowTimePicker(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleSubmit = () => {
    Alert.alert(
      "Abwesenheit bestätigen",
      `Datum: ${formatDate(date)}\nUhrzeit: ${formatTime(time)}`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Bestätigen",
          onPress: () =>
            Alert.alert("Erfolg", "Abwesenheit wurde eingereicht!"),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold mb-6 text-center">
        Abwesenheit planen
      </Text>

      {/* Date Selection */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-semibold mb-3">Datum auswählen</Text>

        <Button
          onPress={showDatePickerHandler}
          variant="outline"
          className="mb-2"
        >
          <Text className="text-lg">{formatDate(date)}</Text>
        </Button>

        <Text className="text-sm text-muted-foreground text-center">
          Tippen Sie hier, um das Datum zu ändern
        </Text>
      </Card>

      {/* Time Selection */}
      <Card className="p-4 mb-6">
        <Text className="text-lg font-semibold mb-3">Uhrzeit auswählen</Text>

        <Button
          onPress={showTimePickerHandler}
          variant="outline"
          className="mb-2"
        >
          <Text className="text-lg">{formatTime(time)}</Text>
        </Button>

        <Text className="text-sm text-muted-foreground text-center">
          Tippen Sie hier, um die Uhrzeit zu ändern
        </Text>
      </Card>

      {/* Summary */}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <Text className="text-lg font-semibold mb-2 text-blue-800">
          Zusammenfassung
        </Text>
        <Text className="text-blue-700">📅 {formatDate(date)}</Text>
        <Text className="text-blue-700">🕐 {formatTime(time)}</Text>
      </Card>

      {/* Submit Button */}
      <Button onPress={handleSubmit} className="w-full">
        <Text className="font-semibold text-lg">Abwesenheit einreichen</Text>
      </Button>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
};

export default FreiScreen;
