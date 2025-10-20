import { StyleSheet } from "react-native";

export const searchResultStyles =StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#6B7280",
    borderRadius: 8,
  },
  backText: {
    color: "#fff",
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  headerSpacer: {
    width: 64,
  },
  resultsContainer: {
    padding: 12,
    paddingBottom: 12,
  },
  singleContainer: {
    padding: 12,
    paddingBottom: 12,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  detailCard: {
    backgroundColor: "rgba(249, 250, 251, 0.7)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  actions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "#3B82F6",
    marginRight: 8,
  },
  claimButton: {
    backgroundColor: "#10B981",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});