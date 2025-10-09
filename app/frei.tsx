import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import * as MailComposer from "expo-mail-composer";
import { toast } from "sonner-native";
import { EMAIL_RECIPIENTS } from "~/lib/constants";

const FreiScreen = () => {
  // Set default dates
  const getMinimumDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(formatDateForInput(getMinimumDate()));
  const [endDate, setEndDate] = useState(formatDateForInput(getMinimumDate()));
  const [reason, setReason] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString("de-DE");
  };

  const resetForm = () => {
    const minDate = formatDateForInput(getMinimumDate());
    setStartDate(minDate);
    setEndDate(minDate);
    setReason("");
  };

  const validateForm = () => {
    if (!reason.trim()) {
      toast.error("Fehler", {
        description: "Bitte geben Sie einen Grund ein.",
      });
      return false;
    }

    // Check if start date is at least 3 days in the future
    const minDate = getMinimumDate();
    minDate.setHours(0, 0, 0, 0);
    const selectedStartDate = new Date(startDate + 'T00:00:00');

    if (selectedStartDate < minDate) {
      toast.error("Fehler", {
        description: "Startdatum muss mindestens 3 Tage in der Zukunft liegen.",
      });
      return false;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error("Fehler", {
        description: "Enddatum muss nach dem Startdatum liegen.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        toast.error("Fehler", {
          description: "E-Mail-App ist nicht verfügbar.",
        });
        return;
      }

      const dateRange = startDate === endDate
        ? `${formatDate(startDate)} (ganztägig)`
        : `${formatDate(startDate)} bis ${formatDate(endDate)}`;

      const emailBody = `Abwesenheitsantrag

Zeitraum: ${dateRange}

Grund: ${reason}

Gesendet am: ${new Date().toLocaleDateString("de-DE")}`;

      const result = await MailComposer.composeAsync({
        recipients: EMAIL_RECIPIENTS,
        subject: `Abwesenheit - ${dateRange}`,
        body: emailBody,
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        toast.success("Gesendet!", {
          description: "Abwesenheit wurde gemeldet.",
        });
        resetForm();
      }
    } catch (error) {
      toast.error("Fehler", {
        description: "Beim Senden ist ein Fehler aufgetreten.",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      <View className="p-4 gap-4">
        <View className="mb-8 mt-8 items-center">
          <Text className="text-3xl font-bold text-red-500">
            Anfrage Abwesenheit
          </Text>
        </View>

        {/* Start Date */}
        <View>
          <Text className="text-lg font-semibold mb-2">Von (Datum)</Text>
          <input
            type="date"
            value={startDate}
            min={formatDateForInput(getMinimumDate())}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              boxSizing: 'border-box',
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
            }}
          />
        </View>

        {/* End Date */}
        <View>
          <Text className="text-lg font-semibold mb-2">Bis (Datum)</Text>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              boxSizing: 'border-box',
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
            }}
          />
        </View>

        {/* Reason */}
        <View>
          <Text className="text-lg font-semibold mb-2">Grund</Text>
          <Textarea
            value={reason}
            onChangeText={setReason}
            placeholder="Warum sind Sie abwesend?"
            numberOfLines={4}
          />
        </View>

        {/* Submit */}
        <Button onPress={handleSubmit} className="bg-red-500 mb-8 mt-4">
          <Text className="text-foreground">Senden</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default FreiScreen;
