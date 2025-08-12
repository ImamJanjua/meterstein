# Phone Call Integration - Implementation Guide

## 📦 No Additional Packages Needed!

The phone call functionality uses **Expo's built-in `Linking` API** - no extra packages required! 🎉

## 🚀 Components Created

### 1. `PhoneCallButton.tsx` (Reusable Phone Button)

A smart phone button component that:

- **Cleans phone numbers** automatically (removes spaces, dashes)
- **Validates device capability** before attempting to call
- **Handles errors gracefully** with German error messages
- **Supports multiple variants** (outline, destructive, secondary, etc.)
- **Pre-fills phone app** with the number ready to dial

### 2. `phone-demo.tsx` (Demo Screen)

Complete example showing different use cases:

- **Emergency numbers** (112, 110)
- **Company contacts**
- **Team members**
- **Different button styles**

## 🎯 Key Features

### ✅ **Smart Number Handling**

- Automatically cleans phone numbers: `"+49 123 456-789"` → `"+49123456789"`
- Supports international formats: `+49`, `0049`, etc.
- Handles German mobile and landline numbers

### ✅ **Device Validation**

- Checks if device supports phone calls before attempting
- Shows appropriate error messages if calling not supported
- Works on simulators (shows error) and real devices

### ✅ **Native Integration**

- Uses device's native phone app
- Number appears pre-filled in dialer
- User can modify number before calling
- Supports all phone app features (contacts, call history, etc.)

## 📱 How It Works

### 1. **User Taps Button**

```typescript
<PhoneCallButton phoneNumber="+49 123 456789" displayName="Kundendienst" />
```

### 2. **Number Gets Cleaned**

- Input: `"+49 123 456-789"`
- Cleaned: `"+49123456789"`
- URL: `"tel:+49123456789"`

### 3. **Device Validation**

```typescript
const canOpen = await Linking.canOpenURL(phoneUrl);
```

### 4. **Phone App Opens**

- Native dialer opens with number pre-filled
- User can see the number and choose to call or modify

## 🔧 Usage Examples

### Basic Phone Button

```typescript
import PhoneCallButton from "~/components/PhoneCallButton";

<PhoneCallButton phoneNumber="+49 123 456789" displayName="Support" />;
```

### Emergency Button (Red Style)

```typescript
<PhoneCallButton
  phoneNumber="112"
  displayName="Notruf (112)"
  variant="destructive"
/>
```

### Custom Styling

```typescript
<PhoneCallButton
  phoneNumber="+49 987 654321"
  displayName="Hauptgeschäft"
  variant="outline"
  className="w-full mb-2"
/>
```

### Direct Linking (Without Component)

```typescript
import * as Linking from "expo-linking";

const handleCall = async () => {
  const phoneUrl = "tel:+49123456789";
  const canOpen = await Linking.canOpenURL(phoneUrl);

  if (canOpen) {
    await Linking.openURL(phoneUrl);
  }
};
```

## 🌍 German Phone Number Formats

The component handles all common German formats:

### **Mobile Numbers:**

- `+49 176 12345678` ✅
- `0176 12345678` ✅
- `+49-176-123-45678` ✅
- `0176/12345678` ✅

### **Landline Numbers:**

- `+49 30 12345678` ✅ (Berlin)
- `030 12345678` ✅
- `+49-89-123456` ✅ (München)

### **Emergency Numbers:**

- `112` ✅ (Notruf)
- `110` ✅ (Polizei)
- `116 117` ✅ (Ärztlicher Bereitschaftsdienst)

## 🎨 Button Variants

### Available Styles:

- **`default`**: Standard blue button
- **`outline`**: Border with transparent background
- **`secondary`**: Gray background
- **`destructive`**: Red (perfect for emergency numbers)
- **`ghost`**: Transparent with hover effect
- **`link`**: Text link style

### Color Examples:

```typescript
// Emergency (Red)
<PhoneCallButton variant="destructive" phoneNumber="112" />

// Business (Blue outline)
<PhoneCallButton variant="outline" phoneNumber="+49123456789" />

// Internal (Gray)
<PhoneCallButton variant="secondary" phoneNumber="123" />
```

## 🛡️ Error Handling

### Device Without Phone Capability:

```
"Anruf nicht möglich"
"Ihr Gerät unterstützt keine Telefonanrufe oder die Telefon-App ist nicht verfügbar."
```

### General Errors:

```
"Fehler"
"Es gab ein Problem beim Öffnen der Telefon-App."
```

## 📋 Supported URL Schemes

### **Phone Calls:**

- `tel:+49123456789` - Opens phone app with number
- `tel:112` - Emergency numbers
- `tel:*100#` - Special codes (like checking balance)

### **SMS (Bonus):**

- `sms:+49123456789` - Opens SMS app
- `sms:+49123456789?body=Hallo` - Pre-filled message

### **Email (Bonus):**

- `mailto:support@company.com` - Opens email app
- `mailto:test@test.com?subject=Hilfe` - With subject

## 🔄 Integration Examples

### In Your Contact List:

```typescript
const contacts = [
  { name: "Support", phone: "+49 123 456789" },
  { name: "Manager", phone: "+49 176 12345678" },
];

{
  contacts.map((contact) => (
    <PhoneCallButton
      key={contact.phone}
      phoneNumber={contact.phone}
      displayName={contact.name}
      variant="outline"
      className="mb-2"
    />
  ));
}
```

### In Emergency Section:

```typescript
<Card className="p-4 border-red-200 bg-red-50">
  <Text className="text-red-800 font-bold mb-3">🚨 Notfall</Text>
  <PhoneCallButton
    phoneNumber="112"
    displayName="Notruf"
    variant="destructive"
    className="w-full"
  />
</Card>
```

### Quick Action from Any Screen:

```typescript
// Add to any screen's header or footer
<TouchableOpacity
  onPress={() => Linking.openURL("tel:+49123456789")}
  className="p-2"
>
  <Phone size={24} color="green" />
</TouchableOpacity>
```

## 📱 Testing

### **On Real Device:**

- Taps open phone app with number pre-filled
- User can see number and choose to call

### **On Simulator:**

- Shows error message (simulators can't make calls)
- Error handling works correctly

### **Different Numbers to Test:**

- `+49 176 12345678` (German mobile)
- `030 12345678` (Berlin landline)
- `112` (Emergency)
- `*100#` (USSD code)

## 🚀 Next Steps

1. **Add to Contact Screens**: Include phone buttons in employee/contact lists
2. **Emergency Section**: Create quick-access emergency contact section
3. **SMS Integration**: Add SMS buttons using `sms:` scheme
4. **Contact Import**: Connect to device contacts using `expo-contacts`
5. **Call History**: Track frequently called numbers

This phone call implementation provides a native, professional experience that German users expect! 📞✨
