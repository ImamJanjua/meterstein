import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { ChevronRight } from "~/lib/icons/index";

const OrderCategoriesScreen = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(
    null
  );

  const categories = [
    {
      id: "kunde",
      name: "Kunde",
      image: require("~/assets/images/kunde-icon.webp"),
      subcategories: [
        {
          id: "markisen",
          name: "Markisen",
          image: require("~/assets/images/markisen.webp"),
          products: [
            {
              id: "unterdach-t200",
              name: "Unterdach T200",
              image: require("~/assets/images/unterdach-t200-example.webp"),
            },
            {
              id: "unterdach-t350",
              name: "Unterdach T350 ZIP",
              image: require("~/assets/images/unterdach-t350-example.webp"), // Using unterdach-t200 as placeholder
            },
            {
              id: "aufdach-t350",
              name: "Aufdach T350 ZIP",
              image: require("~/assets/images/aufdach-t350-example.webp"), // Using unterdach-t200 as placeholder
            },
            {
              id: "senkrecht",
              name: "Senkrecht mit ZIP",
              image: require("~/assets/images/senkrecht-example.webp"), // Using unterdach-t200 as placeholder
            },
            {
              id: "sonnensegel",
              name: "Sonnensegel",
              image: require("~/assets/images/sonnensegel-example.webp"), // Using unterdach-t200 as placeholder
            },
            {
              id: "plissees",
              name: "Plissees",
              image: require("~/assets/images/plissees-example.webp"), // Using unterdach-t200 as placeholder
            },
          ],
        },
        {
          id: "schiebewand",
          name: "Schiebewand",
          image: require("~/assets/images/schiebewand.webp"), // Using markisen as placeholder
          products: [
            {
              id: "schiebewand",
              name: "Schiebewand",
              image: require("~/assets/images/schiebewand.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "fertiges-dreieck",
          name: "Fertiges Dreieck",
          image: require("~/assets/images/fertiges-dreieck.webp"), // Using markisen as placeholder
          products: [
            {
              id: "fertiges-dreieck",
              name: "Fertiges Dreieck",
              image: require("~/assets/images/fertiges-dreieck.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "glas",
          name: "Glas",
          image: require("~/assets/images/glas.webp"), // Using markisen as placeholder
          products: [
            {
              id: "glas-rechteck",
              name: "Rechteck Glas",
              image: require("~/assets/images/glas.webp"),
            },
            {
              id: "glas-dreieck",
              name: "Dreieck Glas",
              image: require("~/assets/images/glas-dreieck.jpeg"),
            },
            {
              id: "festwand-glas",
              name: "Festwand Glas",
              image: require("~/assets/images/festwand.webp"),
            },
          ],
        },
        {
          id: "dreieck-profile-selber-bauen",
          name: "Dreieck Profile selber bauen",
          image: require("~/assets/images/dreieck-profile-selber-bauen.webp"), // Using markisen as placeholder
          products: [
            {
              id: "dreieck-profile-selber-bauen",
              name: "Dreieck Profile selber bauen",
              image: require("~/assets/images/dreieck-profile-selber-bauen.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "pfosten",
          name: "Pfosten",
          image: require("~/assets/images/pfosten.webp"), // Using markisen as placeholder
          products: [
            {
              id: "pfosten",
              name: "Pfosten",
              image: require("~/assets/images/pfosten.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "rinne",
          name: "Rinne",
          image: require("~/assets/images/rinne.webp"), // Using markisen as placeholder
          products: [
            {
              id: "rinne",
              name: "Rinne",
              image: require("~/assets/images/rinne.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "sparren",
          name: "Sparren",
          image: require("~/assets/images/sparren.webp"), // Using markisen as placeholder
          products: [
            {
              id: "sparren",
              name: "Sparren",
              image: require("~/assets/images/sparren.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "wandanschluss",
          name: "Wandanschluss",
          image: require("~/assets/images/wandanschluss.webp"), // Using markisen as placeholder
          products: [
            {
              id: "wandanschluss",
              name: "Wandanschluss",
              image: require("~/assets/images/wandanschluss.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "paneele",
          name: "Paneele",
          image: require("~/assets/images/paneele.webp"), // Using markisen as placeholder
          products: [
            {
              id: "paneele",
              name: "Paneele",
              image: require("~/assets/images/paneele.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "winkel",
          name: "Winkel",
          image: require("~/assets/images/winkel.webp"), // Using markisen as placeholder
          products: [
            {
              id: "winkel",
              name: "Winkel",
              image: require("~/assets/images/winkel.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "statiktraeger",
          name: "Statikträger",
          image: require("~/assets/images/statiktraeger.webp"), // Using markisen as placeholder
          products: [
            {
              id: "statiktraeger",
              name: "Statikträger",
              image: require("~/assets/images/statiktraeger.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "somfy",
          name: "Somfy",
          image: require("~/assets/images/somfy.jpg"), // Using markisen as placeholder
          products: [
            {
              id: "somfy",
              name: "Somfy",

              image: require("~/assets/images/somfy.jpg"), // Using markisen as placeholder
            },
          ],
        },
      ],
    },
    {
      id: "lager",
      name: "Lager",
      image: require("~/assets/images/lager-icon.webp"),
      subcategories: [
        {
          id: "beton",
          name: "Beton",
          image: require("~/assets/images/beton.webp"), // Using markisen as placeholder
          products: [
            {
              id: "beton",
              name: "Beton",
              image: require("~/assets/images/beton.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "duebel",
          name: "Dübel",
          image: require("~/assets/images/duebel.webp"), // Using markisen as placeholder
          products: [
            {
              id: "duebel",
              name: "Dübel",
              image: require("~/assets/images/duebel.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "led",
          name: "Led spot 6er",
          image: require("~/assets/images/led.webp"), // Using markisen as placeholder
          products: [
            {
              id: "led",
              name: "Led spot 6er",
              image: require("~/assets/images/led.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "silikon",
          name: "Silikon",
          image: require("~/assets/images/silikon.webp"), // Using markisen as placeholder
          products: [
            {
              id: "silikon",
              name: "Silikon",
              image: require("~/assets/images/silikon.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "flexscheiben",
          name: "Flexscheiben",
          image: require("~/assets/images/flexscheiben.webp"), // Using markisen as placeholder
          products: [
            {
              id: "flexscheiben",
              name: "Flexscheiben",
              image: require("~/assets/images/flexscheiben.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "kompriband",
          name: "Kompriband",
          image: require("~/assets/images/kompriband.webp"), // Using markisen as placeholder
          products: [
            {
              id: "kompriband",
              name: "Kompriband",
              image: require("~/assets/images/kompriband.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "thermax",
          name: "Thermax",
          image: require("~/assets/images/thermax.webp"), // Using markisen as placeholder
          products: [
            {
              id: "thermax",
              name: "Thermax",
              image: require("~/assets/images/thermax.webp"), // Using markisen as placeholder
            },
          ],
        },
        {
          id: "bohrer",
          name: "Bohrer",
          image: require("~/assets/images/bohrer.webp"), // Using markisen as placeholder
          products: [
            {
              id: "steinbohrer",
              name: "Steinbohrer",
              image: require("~/assets/images/steinbohrer.webp"), // Using markisen as placeholder
            },
            {
              id: "metallbohrer",
              name: "Metallbohrer",
              image: require("~/assets/images/metallbohrer.webp"), // Using markisen as placeholder
            },
          ],
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 pb-8 gap-4 flex-1 justify-center">
        {/* Header */}
        <View className="mb-16 mt-8 items-center">
          <Text className="text-3xl font-bold text-red-500 mb-2">
            Bestellung
          </Text>
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
                          // If subcategory has only one product, navigate directly to it
                          if (subcategory.products?.length === 1) {
                            router.push(
                              `/order/${subcategory.products[0].id}` as any
                            );
                          } else {
                            // Otherwise, toggle the accordion
                            setExpandedSubcategory(
                              expandedSubcategory === subcategory.id
                                ? null
                                : subcategory.id
                            );
                          }
                        }}
                        className="p-4 flex-row items-center justify-between bg-secondary/20 border-t border-red-500/40 border-b border-red-500/40"
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
                                ? "Direkt zum Produkt"
                                : `${subcategory.products?.length} Produkte verfügbar`}
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
                                // Navigate to specific product form
                                router.push(`/order/${product.id}` as any);
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
        {/* Direct Navigation Buttons */}
        <View className="h-px bg-red-500 mx-4 my-2 mt-4" />

        <Card className="overflow-hidden">
          <TouchableOpacity
            onPress={() => router.push("/order/werkzeugdefekt" as any)}
            className="p-4 flex-row items-center justify-between bg-primary/5"
          >
            <View className="flex-row items-center gap-3">
              <Image
                source={require("~/assets/images/werkzeugdefekt-icon.webp")}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                }}
              />
              <Text className="text-lg font-semibold">Werkzeugdefekt</Text>
            </View>
            <ChevronRight className="w-6 h-6 text-foreground" />
          </TouchableOpacity>
        </Card>

        <View className="h-px bg-red-500 mx-4 my-2" />

        <Card className="overflow-hidden">
          <TouchableOpacity
            onPress={() => router.push("/order/sonstiges" as any)}
            className="p-4 flex-row items-center justify-between bg-primary/5"
          >
            <View className="flex-row items-center gap-3">
              <Image
                source={require("~/assets/images/sonstiges-icon.webp")}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                }}
              />
              <Text className="text-lg font-semibold">Sonstiges</Text>
            </View>
            <ChevronRight className="w-6 h-6 text-foreground" />
          </TouchableOpacity>
        </Card>

        <View className="h-px bg-red-500 mx-4 my-2" />

        <Card className="overflow-hidden">
          <TouchableOpacity
            onPress={() => router.push("/order/bauhauskarte" as any)}
            className="p-4 flex-row items-center justify-between bg-primary/5"
          >
            <View className="flex-row items-center gap-3">
              <Image
                source={require("~/assets/images/bauhauskarte-icon.webp")}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                }}
              />
              <Text className="text-lg font-semibold">Bauhauskarte</Text>
            </View>
            <ChevronRight className="w-6 h-6 text-foreground" />
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
};

export default OrderCategoriesScreen;
