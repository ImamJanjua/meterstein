import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";

const DeliveryCategoriesScreen = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(
    null
  );

  const categories = [
    {
      id: "abholung",
      name: "Abholung",
      icon: "📦",
      subcategories: [
        {
          id: "container",
          name: "Container",
          image: require("~/assets/images/container.webp"),
          products: [
            {
              id: "container",
              name: "Container",
              image: require("~/assets/images/container.webp"),
            },
          ],
        },
        {
          id: "glaskiste",
          name: "Glaskiste",
          image: require("~/assets/images/glaskiste.webp"),
          products: [
            {
              id: "glaskiste",
              name: "Glaskiste",
              image: require("~/assets/images/glaskiste.webp"),
            },
          ],
        },
        {
          id: "panoramakiste",
          name: "Panoramakiste",
          image: require("~/assets/images/panoramakiste.webp"),
          products: [
            {
              id: "panoramakiste",
              name: "Panoramakiste",
              image: require("~/assets/images/panoramakiste.webp"),
            },
          ],
        },
        {
          id: "profilplatte",
          name: "Profilplatte",
          image: require("~/assets/images/profilplatte.webp"),
          products: [
            {
              id: "profilplatte",
              name: "Profilplatte",
              image: require("~/assets/images/profilplatte.webp"),
            },
          ],
        },
        {
          id: "holzblock",
          name: "Holzblock",
          image: require("~/assets/images/holzblock.webp"),
          products: [
            {
              id: "holzblock",
              name: "Holzblock",
              image: require("~/assets/images/holzblock.webp"),
            },
          ],
        },
        {
          id: "styropor",
          name: "Styropor",
          image: require("~/assets/images/styropor.webp"),
          products: [
            {
              id: "styropor",
              name: "Styropor",
              image: require("~/assets/images/styropor.webp"),
            },
          ],
        },
        {
          id: "abgeholter-retourenbeleg",
          name: "Abgeholter Retourenbeleg",
          image: require("~/assets/images/abgeholter-retourenbeleg.webp"),
          products: [
            {
              id: "abgeholter-retourenbeleg",
              name: "Abgeholter Retourenbeleg",
              image: require("~/assets/images/abgeholter-retourenbeleg.webp"),
            },
          ],
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-3">
        {/* Wareneingang Direct Button */}
        <Card className="overflow-hidden">
          <TouchableOpacity
            onPress={() => router.push("/delivery/wareneingang" as any)}
            className="p-4 flex-row items-center justify-between bg-primary/5"
          >
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">📥</Text>
              <Text className="text-lg font-semibold">Wareneingang</Text>
            </View>
            <Text className="text-lg">→</Text>
          </TouchableOpacity>
        </Card>

        {/* Abholung Accordion */}
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <TouchableOpacity
              onPress={() =>
                setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )
              }
              className="p-4 flex-row items-center justify-between bg-primary/5"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">{category.icon}</Text>
                <Text className="text-lg font-semibold">{category.name}</Text>
              </View>
              <Text className="text-lg">
                {expandedCategory === category.id ? "−" : "+"}
              </Text>
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
                            `/delivery/${subcategory.products[0].id}` as any
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
                      className="p-4 flex-row items-center justify-between bg-secondary/20 border-b border-border/30"
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
                              ? "Direkt zur Abholung"
                              : `${subcategory.products?.length} Produkte verfügbar`}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-lg">
                        {subcategory.products?.length === 1
                          ? "→"
                          : expandedSubcategory === subcategory.id
                          ? "−"
                          : "+"}
                      </Text>
                    </TouchableOpacity>

                    {expandedSubcategory === subcategory.id && (
                      <View className="bg-background">
                        {subcategory.products?.map((product) => (
                          <TouchableOpacity
                            key={product.id}
                            onPress={() => {
                              // Navigate to specific product form
                              router.push(`/delivery/${product.id}` as any);
                            }}
                            className="p-3 pl-8 flex-row items-center justify-between border-b border-border/50"
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
                            <Text className="text-primary">→</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

export default DeliveryCategoriesScreen;
