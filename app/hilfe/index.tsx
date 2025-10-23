import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { ChevronRight } from "~/lib/icons/index";
import { openExternalLinkById } from "~/lib/external-links";

const HilfeScreen = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(
    null
  );

  const categories = [
    {
      id: "inbetriebnahme",
      name: "Inbetriebnahme",
      image: require("~/assets/images/inbetriebnahme.webp"),
      subcategories: [
        {
          id: "lamellendach-sb1400",
          name: "Lamellendach SB1400",
          image: require("~/assets/images/lamellendach-sb-1400.webp"),
          products: [
            {
              id: "sb1400",
              name: "SB1400",
              image: require("~/assets/images/sb1400.webp"),
            },
            {
              id: "lamellendach-sb1400-verkabelung",
              name: "Verkabelung",
              image: require("~/assets/images/verkabelung.webp"),
            },
            {
              id: "lamellendach-sb1400-motor-einlernen",
              name: "Motor einlernen",
              image: require("~/assets/images/motor-einlernen.webp"),
            },
            {
              id: "lamellendach-sb1400-led-einlernen",
              name: "LED einlernen",
              image: require("~/assets/images/led-einlernen.webp"),
            },
          ],
        },
        {
          id: "lamellendach-toskana",
          name: "Lamellendach Toskana",
          image: require("~/assets/images/lamellendach-toskana.webp"),
          products: [
            {
              id: "toskana",
              name: "Toskana",
              image: require("~/assets/images/toskana.webp"),
            },
            {
              id: "lamellendach-toskana-verkabelung",
              name: "Verkabelung",
              image: require("~/assets/images/verkabelung.webp"),
            },
            {
              id: "lamellendach-toskana-motor-einlernen",
              name: "Motor einlernen",
              image: require("~/assets/images/motor-einlernen.webp"),
            },
            {
              id: "lamellendach-toskana-led-einlernen",
              name: "LED einlernen",
              image: require("~/assets/images/led-einlernen.webp"),
            },
          ],
        },
        {
          id: "lamellendach-tende",
          name: "Lamellendach Tende",
          image: require("~/assets/images/tarasola-tende.webp"),
          products: [
            {
              id: "tarasola-tende",
              name: "Tarasola Tende",
              image: require("~/assets/images/tarasola-tende.webp"),
            },
            {
              id: "lamellendach-tende-verkabelung",
              name: "Verkabelung",
              image: require("~/assets/images/verkabelung.webp"),
            },
            {
              id: "lamellendach-tende-motor-einlernen",
              name: "Motor einlernen",
              image: require("~/assets/images/motor-einlernen.webp"),
            },
            {
              id: "lamellendach-tende-led-einlernen",
              name: "LED einlernen",
              image: require("~/assets/images/led-einlernen.webp"),
            },
          ],
        },
        {
          id: "markisen",
          name: "Markisen",
          image: require("~/assets/images/markisen-hilfe-inbetriebnahme.webp"),
          products: [
            {
              id: "einstellungen-wt-motor",
              name: "Einstellungen WT Motor",
              image: require("~/assets/images/einstellungen-wt-motor.webp"),
            },
            {
              id: "set-go",
              name: "Set & Go",
              image: require("~/assets/images/set-go.webp"),
            },
            {
              id: "programmierung-endlagen",
              name: "Programmierung Endlagen",
              image: require("~/assets/images/motor-einlernen.webp"),
            },
          ],
        },
        {
          id: "led-einstellungen",
          name: "LED Einstellungen",
          image: require("~/assets/images/leds-hilfe.webp"),
          products: [
            {
              id: "led-einstellungen",
              name: "LED Einstellungen",
              image: require("~/assets/images/leds-hilfe.webp"),
            },
          ],
        },
        {
          id: "sensoren",
          name: "Sensoren",
          image: require("~/assets/images/sensoren-hilfe.webp"),
          products: [
            {
              id: "regensensor-einlernen",
              name: "Regensensor einlernen",
              image: require("~/assets/images/regensensor-einlernen.webp"),
            },
            {
              id: "windsensor-einlernen",
              name: "Windsensor einlernen",
              image: require("~/assets/images/sensoren-hilfe.webp"),
            },
            {
              id: "white-receiver",
              name: "White Receiver",
              image: require("~/assets/images/white-reciver.webp"),
            },
          ],
        },
        {
          id: "dreieck-festelement",
          name: "Dreieck & Festelement",
          image: require("~/assets/images/dreieck-festelement.webp"),
          products: [
            {
              id: "dreieck-festelement",
              name: "Dreieck & Festelement",
              image: require("~/assets/images/dreieck-festelement.webp"),
            },
          ],
        },
        {
          id: "markisen-montage",
          name: "Markisen",
          image: require("~/assets/images/markisen-hilfe.webp"),
          products: [
            {
              id: "seilspannmarkisen",
              name: "Seilspannmarkisen",
              image: require("~/assets/images/markisen-hilfe.webp"),
            },
            {
              id: "t200",
              name: "T200",
              image: require("~/assets/images/t200-hilfe.webp"),
            },
            {
              id: "t200-mehrteilig",
              name: "T200 Mehrteilig",
              image: require("~/assets/images/t200-mehrteilig.webp"),
            },
            {
              id: "kastenmarkisen",
              name: "Kastenmarkisen",
              image: require("~/assets/images/kastenmarkisen.webp"),
            },
            {
              id: "aufdachmarkise",
              name: "Aufdachmarkise",
              image: require("~/assets/images/aufdachmarkise.webp"),
            },
            {
              id: "zugband-wechseln",
              name: "Zugband wechseln",
              image: require("~/assets/images/zugband-wechsel.webp"),
            },
          ],
        },
        {
          id: "glasdaecher",
          name: "Glasdächer",
          image: require("~/assets/images/classic-prime.webp"),
          products: [
            {
              id: "classic-prime-line",
              name: "Classic & Prime-Line",
              image: require("~/assets/images/classic-prime.webp"),
            },
            {
              id: "cube-line-classic",
              name: "Cube-Line Classic",
              image: require("~/assets/images/cube-line.webp"),
            },
            {
              id: "cube-line-style",
              name: "Cube-Line Style",
              image: require("~/assets/images/cube-line-style.webp"),
            },
            {
              id: "cube-line-compact",
              name: "Cube-Line Compact",
              image: require("~/assets/images/cube-line-compact.webp"),
            },
            {
              id: "cabrio-line",
              name: "Cabrio-Line",
              image: require("~/assets/images/cabrio.webp"),
            },
          ],
        },
        {
          id: "freistand",
          name: "Freistand",
          image: require("~/assets/images/freistand.webp"),
          products: [
            {
              id: "freistand",
              name: "Freistand",
              image: require("~/assets/images/freistand.webp"),
            },
          ],
        },
      ],
    },
    // Nützliches
    {
      id: "nuetzliches",
      name: "Nützliches",
      image: require("~/assets/images/nuetzliches.webp"),
      subcategories: [
        {
          id: "sonstiges",
          name: "Sonstiges",
          image: require("~/assets/images/sonstiges-icon.webp"),
          products: [
            {
              id: "statikanfrage",
              name: "Statikanfrage",
              image: require("~/assets/images/statikanfrage.webp"),
            },
            {
              id: "baugenehmigung",
              name: "Baugenehmigung",
              image: require("~/assets/images/baugenehmigung.webp"),
            },
            {
              id: "glasrichtlinien",
              name: "Glasrichtlinien",
              image: require("~/assets/images/glasrichtlinien.webp"),
            },
            {
              id: "gewichtsermittlung",
              name: "Gewichtsermittlung",
              image: require("~/assets/images/gewichtsvermittlung.webp"),
            },
            {
              id: "reklamationsformular",
              name: "Reklamationsformular",
              image: require("~/assets/images/reklamationsformular.webp"),
            },
            {
              id: "fundamentplan",
              name: "Fundamentplan",
              image: require("~/assets/images/fundamentplan.webp"),
            },
          ],
        },
        {
          id: "markisenstoffe",
          name: "Markisenstoffe",
          image: require("~/assets/images/markisenstoffe.webp"),
          products: [
            {
              id: "unter-aufdach",
              name: "Unter- & Aufdach",
              image: require("~/assets/images/markisenstoffe.webp"),
            },
            {
              id: "senkrecht",
              name: "Senkrecht",
              image: require("~/assets/images/senkrecht-hilfe.webp"),
            },
            {
              id: "sonnensegel",
              name: "Sonnensegel",
              image: require("~/assets/images/sonnensegel.jpeg"),
            },
          ],
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4 flex-1 justify-center">
        {/* Header */}
        <View className="mb-16 mt-8 items-center">
          <Text className="text-3xl font-bold text-red-500 mb-2">Hilfe</Text>
          <Text className="text-lg text-muted-foreground">
            Wählen Sie eine Kategorie aus
          </Text>
        </View>

        {categories.map((category, index) => (
          <View key={category.id}>
            <Card className="overflow-hidden">
              <TouchableOpacity
                onPress={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
                className="p-4 flex-row items-center justify-between bg-primary/5"
              >
                <View className="flex-row items-center gap-3">
                  <Image
                    source={category.image}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                    }}
                  />
                  <Text className="text-lg font-semibold">{category.name}</Text>
                </View>
                <ChevronRight className="w-6 h-6 text-foreground" />
              </TouchableOpacity>

              {expandedCategory === category.id && (
                <View className="border-t border-border">
                  {category.subcategories.map((subcategory) => (
                    <View key={subcategory.id}>
                      <TouchableOpacity
                        onPress={() => {
                          // If subcategory has only one product, open external link directly
                          if (subcategory.products?.length === 1) {
                            openExternalLinkById(subcategory.products[0].id);
                          } else {
                            // Otherwise, toggle the accordion
                            setExpandedSubcategory(
                              expandedSubcategory === subcategory.id
                                ? null
                                : subcategory.id
                            );
                          }
                        }}
                        className="p-4 flex-row items-center justify-between bg-secondary/20 border-b border-red-500/40"
                      >
                        <View className="flex-row items-center gap-3 flex-1">
                          <Image
                            source={subcategory.image}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={200}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 8,
                            }}
                          />
                          <View className="flex-1">
                            <Text className="font-medium text-lg">
                              {subcategory.name}
                            </Text>
                            <Text className="text-sm text-muted-foreground">
                              {subcategory.products?.length === 1
                                ? "PDF wird geöffnet"
                                : `${subcategory.products?.length} Anleitungen verfügbar`}
                            </Text>
                          </View>
                        </View>
                        <ChevronRight className="w-6 h-6 text-foreground" />
                      </TouchableOpacity>

                      {expandedSubcategory === subcategory.id && (
                        <View className="bg-background">
                          {subcategory.products?.map((product) => (
                            <TouchableOpacity
                              key={product.id}
                              onPress={() => {
                                // Open external link directly
                                openExternalLinkById(product.id);
                              }}
                              className="p-3 pl-8 flex-row items-center justify-between border-b border-border/40"
                            >
                              <View className="flex-row items-center gap-3 flex-1">
                                <Image
                                  source={product.image}
                                  contentFit="cover"
                                  cachePolicy="memory-disk"
                                  transition={200}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 6,
                                  }}
                                />
                                <View className="flex-1">
                                  <Text className="font-medium">
                                    {product.name}
                                  </Text>
                                </View>
                              </View>
                              <ChevronRight className="w-6 h-6 text-foreground" />
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </Card>
            {index < categories.length - 1 && (
              <View className="h-px bg-red-500 mx-4 my-2 mt-6" />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HilfeScreen;
