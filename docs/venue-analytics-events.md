# Venue Page Google Analytics Events

This document catalogs all Google Analytics tracking events on the VenueDetail.tsx page.

## Event Structure
All events use `trackEvent(eventName, category, label, value?)` format.

---

## Page Load Events

| Event Name | Category | Label | Description |
|------------|----------|-------|-------------|
| `venue_view` | engagement | venue name | Triggered when venue page loads |

---

## Header Section Events

| Event Name | Category | Label | Description |
|------------|----------|-------|-------------|
| `claim_button_click` | venue_header | venue name | User clicks "Claim This Venue" button |
| `get_directions_header` | navigation | venue name | User clicks "Open in Google Maps" link in header |
| `specials_badge_click` | venue_badge | venue name | User clicks specials pill badge |
| `reservations_badge_click` | venue_badge | venue name | User clicks reservations pill badge |

---

## Contact Card Events

| Event Name | Category | Label | Description |
|------------|----------|-------|-------------|
| `click_to_call` | contact | venue name | User clicks phone number link |
| `click_to_email` | contact | venue name | User clicks email link |
| `outbound_to_venue` | contact | venue name | User clicks "Visit Website" link |
| `specials_click` | contact | venue name | User clicks "View Specials" link |
| `get_directions_contact` | navigation | venue name | User clicks "Open in Google Maps" in contact card |

---

## Social Media Links

| Event Name | Category | Label | Description |
|------------|----------|-------|-------------|
| `social_click` | facebook | venue name | User clicks Facebook profile link |
| `social_click` | instagram | venue name | User clicks Instagram profile link |
| `social_click` | twitter | venue name | User clicks Twitter/X profile link |
| `social_click` | tiktok | venue name | User clicks TikTok profile link |

---

## Review Section Events

| Event Name | Category | Label | Description |
|------------|----------|-------|-------------|
| `review_button_click` | engagement | venue name | User clicks "Write a Review" button |
| `accuracy_vote` | engagement | venue name | User submits accuracy vote (value: -1) |

---

## Share Section Events

| Event Name | Category | Label | Description |
|------------|----------|-------|-------------|
| `save_venue` | engagement | venue name | User saves venue to their collection |
| `unsave_venue` | engagement | venue name | User removes venue from saved collection |
| `share_facebook` | social | venue name | User clicks Facebook share button |
| `share_twitter` | social | venue name | User clicks X/Twitter share button |
| `share_whatsapp` | social | venue name | User clicks WhatsApp share button |
| `share_sms` | social | venue name | User clicks SMS share button |
| `copy_link` | social | venue name | User clicks Copy Link button |

---

## Floating Action Button (FAB) Events

| Event Name | Category | Label | Description |
|------------|----------|-------|-------------|
| `fab_reserve_click` | engagement | venue name | User clicks Reserve button in FAB |
| `fab_specials_click` | engagement | venue name | User clicks Specials button in FAB |
| `fab_website_click` | engagement | venue name | User clicks Website button in FAB |

---

## Summary Statistics

- **Total Unique Event Names**: 22
- **Categories Used**: engagement, contact, navigation, social, venue_badge, venue_header, facebook, instagram, twitter, tiktok
- **Last Updated**: December 22, 2025
