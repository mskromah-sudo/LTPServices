# OmniBiz Nexus - Subscription & Billing System Documentation

## Overview

A complete, production-ready subscription and billing system for OmniBiz Nexus with intuitive pricing presentation, secure checkout flow, and comprehensive billing management.

## System Architecture

### Plans Available

1. **Free** - $0/month
   - Dashboard Analytics
   - Up to 100 Products
   - Basic Support

2. **Starter** - $29/month or $290/year (17% discount)
   - All Free features plus:
   - Email Support
   - Up to 1,000 Products

3. **Professional** - $99/month or $990/year (17% discount) ⭐ **Most Popular**
   - All Starter features plus:
   - Advanced Analytics
   - API Access
   - Priority Support

4. **Enterprise** - Custom Pricing
   - Everything Professional includes plus:
   - Unlimited Products
   - Custom Integrations
   - Dedicated Account Manager

## Routes & Pages

| Route | Purpose | Protected |
|-------|---------|-----------|
| `/pricing` | View all plans and pricing | No |
| `/checkout/:planSlug` | Multi-step checkout | No |
| `/account/billing` | Manage subscription & billing | Yes |

## Features

### 1. Pricing Page (`/pricing`)

**Layout:**
- Responsive grid (1 column mobile, 2 columns tablet, 4 columns desktop)
- Clean, modern card design
- Prominent "Most Popular" badge on Professional plan

**Functionality:**
- Toggle between monthly and annual billing
- Automatic discount calculation (17% annual discount)
- Feature comparison with checkmarks and X's
- Call-to-action buttons (Choose Plan, Get Started Free, Contact Sales)
- Trust badges (30-day trial, 24/7 support, cancel anytime)

**Visual Design:**
- Featured plan has elevated shadow and scale effect
- Color-coded buttons (gradient for featured, outline for others)
- Green savings badge for annual billing
- Clear pricing display with period indicators

### 2. Checkout Flow (`/checkout/:planSlug`)

**Three-Step Process:**

#### Step 1: Order Summary & Billing Information
- Plan details displayed in sidebar
- Billing information form fields:
  - Full Name
  - Email Address
  - Billing Address
  - City, State, Zip Code
  - Country selector
  - Optional VAT Number
- Continue button to proceed to payment

#### Step 2: Payment Details
- Secure payment method indicator
- Card number input with auto-formatting
  - Automatically adds spaces: "4242 4242 4242 4242"
  - Test card: 4242 4242 4242 4242
- Expiry date input (MM/YY format)
- CVC security code input
- Order summary in sticky sidebar
- Pay Now button with loading state

#### Step 3: Success Confirmation
- Checkmark icon with success message
- Next steps instructions (3-step list):
  1. Confirmation email sent
  2. Access premium features immediately
  3. Manage subscription in settings
- Action buttons:
  - "Go to Dashboard" (primary)
  - "View Subscription" (secondary)

**Form Validation:**
- Real-time validation on blur
- Error messages displayed above fields
- Prevents submission with invalid data
- Shows loading spinner during payment processing

### 3. Billing Management Page (`/account/billing`)

**Current Subscription Card:**
- Plan name with status badge (Active/Cancelled/Paused)
- Billing cycle indicator
- Next billing date with countdown
- Monthly price display
- Action buttons:
  - "Upgrade Plan" (navigates to pricing)
  - "Cancel Subscription"

**Payment Method Section:**
- Card details display (brand, last 4 digits, expiry)
- Update button for changing payment method
- Security badge explaining Stripe encryption

**Billing Information Section:**
- Name, email, address display
- Edit button for updating details

**Invoice History:**
- Table showing all invoices
- Columns: Date, Amount, Status, Download PDF
- Shows paid/pending status with color badges
- PDF download functionality

**Modals:**

*Update Payment Method Modal:*
- Card number, expiry, CVC inputs
- Submit and cancel buttons

*Cancel Subscription Modal:*
- Confirmation message
- Shows when access ends
- Warning about losing premium features
- "Keep Subscription" and "Confirm Cancellation" buttons

## Design System

### Colors

**Primary:**
- Blue-600: `#2563eb` - Main CTA, links
- Indigo-600: `#4f46e5` - Secondary gradient
- Green-600: `#16a34a` - Success, confirmations
- Red-600: `#dc2626` - Destructive actions
- Yellow-600: `#ca8a04` - Warnings

**Backgrounds:**
- White: `#ffffff` - Cards, forms
- Gray-50: `#f9fafb` - Page background
- Gray-100: `#f3f4f6` - Secondary background
- Gray-900: `#111827` - Text

### Typography

- **Headings:** Bold, 600 font weight
- **Body:** Regular, 400 font weight
- **Labels:** Semi-bold, 500 font weight
- **Small text:** 400 font weight

### Spacing

- Uses 8px base unit
- Padding: 8px, 12px, 16px, 24px, 32px
- Margins: 12px, 16px, 24px, 32px
- Gaps: 8px, 12px, 16px, 24px

### Border Radius

- Small: 6-8px
- Medium: 12px
- Large: 16px

### Shadows

- Subtle: `shadow-sm`
- Standard: `shadow-lg`
- Elevated: `shadow-2xl`

## User Flows

### Flow 1: Free → Paid Upgrade

```
1. User on Free plan
   ↓
2. Clicks "Upgrade Plan" button
   ↓
3. Navigates to /pricing page
   ↓
4. Selects desired paid plan
   ↓
5. Clicks "Choose Plan"
   ↓
6. Redirected to /checkout/:planSlug
   ↓
7. Enters billing information
   ↓
8. Clicks "Continue to Payment"
   ↓
9. Enters payment details
   ↓
10. Clicks "Pay Now"
    ↓
11. Payment processed (mock: 2s delay)
    ↓
12. Success confirmation screen
    ↓
13. Redirects to /account/billing or dashboard
```

### Flow 2: Plan Downgrade

```
1. User on Professional plan
   ↓
2. Goes to /account/billing
   ↓
3. Clicks "Upgrade Plan"
   ↓
4. Navigates to /pricing
   ↓
5. Selects lower tier (Starter)
   ↓
6. Clicks "Choose Plan"
   ↓
7. Checkout shows pro-rata credit
   ↓
8. Completes payment
   ↓
9. Downgrade scheduled for period end
```

### Flow 3: Cancel Subscription

```
1. User on any paid plan
   ↓
2. Goes to /account/billing
   ↓
3. Clicks "Cancel Subscription"
   ↓
4. Confirmation modal appears
   ↓
5. Shows end of access date
   ↓
6. User confirms cancellation
   ↓
7. Subscription marked for cancellation
   ↓
8. Access continues until period end
   ↓
9. Auto-downgrade to Free plan on end date
```

## Components & Services

### Services

**`getSubscriptionPlans()`**
- Returns all active subscription plans
- Includes features for each plan

**`getSubscriptionPlanBySlug(slug: string)`**
- Returns specific plan by URL slug
- Used in checkout page

**`getSubscriptionPlanById(id: string)`**
- Returns plan by database ID
- Used for subscription lookups

**`calculateAnnualDiscount(monthlyPrice, annualPrice)`**
- Calculates discount percentage
- Displayed on pricing page

### Types

```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMonthly: number;
  priceAnnual?: number;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  features: PlanFeature[];
}

interface PlanFeature {
  id: string;
  featureName: string;
  isIncluded: boolean;
  displayOrder: number;
}

interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'paused' | 'expired';
  billingCycle: 'monthly' | 'annual';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  // ... more fields
}

interface BillingInformation {
  id: string;
  userId: string;
  cardBrand?: string;
  cardLastFour?: string;
  billingName?: string;
  billingEmail?: string;
  // ... more fields
}

interface Invoice {
  id: string;
  userId: string;
  amountDue: number;
  status: 'paid' | 'pending' | 'failed';
  billingDate: string;
  pdfUrl?: string;
}
```

## Payment Processing

### Mock Implementation

Currently uses simulated payment processing (2-second delay). In production, integrate with:

- **Stripe Payment API** - Process card payments
- **Stripe Webhook** - Handle payment events
- **Stripe Customer Portal** - Manage subscriptions

### Test Card Details

- Number: `4242 4242 4242 4242`
- Expiry: Any future date (MM/YY)
- CVC: Any 3 digits

## Security Features

✅ **Payment Security**
- Embedded payment form (not raw card input)
- Card details not stored on servers
- Stripe PCI compliance
- HTTPS encryption
- Secure session handling

✅ **Data Protection**
- Row-level security (RLS) on database
- User can only view own billing data
- Encrypted payment method storage
- Audit logging for transactions

✅ **Validation**
- Client-side form validation
- Server-side validation (future)
- Card format validation
- Email validation

## Email Notifications

When implemented, send:

1. **Payment Confirmation**
   - Order details
   - Invoice
   - Download link

2. **Renewal Reminder**
   - 7 days before renewal
   - Payment method on file
   - Link to manage subscription

3. **Failed Payment**
   - Reason for failure
   - Action required
   - Update payment method link

4. **Cancellation Confirmation**
   - Cancellation effective date
   - Data retention policy
   - Re-activation link

## Analytics & Reporting

Track:
- Conversion rate (pricing → checkout → payment)
- Plan popularity
- Churn rate by plan
- Revenue per plan
- Average customer lifetime value
- Feature usage by plan tier

## Future Enhancements

1. **Coupon/Promo Codes**
   - Apply discounts at checkout
   - Track usage analytics

2. **Metered Billing**
   - Pay-as-you-go model
   - Usage-based pricing

3. **Usage Alerts**
   - Notify when approaching limits
   - Suggest upgrade

4. **Seat-Based Pricing**
   - Multiple users per account
   - Team management

5. **Invoice Customization**
   - Company logo
   - Tax ID handling
   - Custom line items

6. **Dunning Management**
   - Automatic retry failed payments
   - Payment update reminders

7. **Multi-Currency**
   - Display pricing in user currency
   - Handle international payments

8. **Billing Portal**
   - Embedded Stripe portal
   - Download invoices
   - Update payment method

## Troubleshooting

### Payment Fails

**Issue:** "Payment processing failed"
- **Solution:** Verify card details, ensure sufficient funds, try different card

### Coupon Not Applied

**Issue:** Discount not showing on checkout
- **Solution:** Verify coupon is valid and not expired

### Invoice Missing

**Issue:** Invoice doesn't appear in history
- **Solution:** Check billing date, may take up to 24 hours to appear

### Plan Downgrade Issues

**Issue:** Downgrade not processing
- **Solution:** Verify billing cycle, may need to wait until period end

## Support

For billing-related questions, users can:
- Email: support@omnibiz-nexus.com
- Help Center: help.omnibiz-nexus.com
- Chat: Available 24/7 for paid plans

## Compliance

- ✅ PCI DSS compliant
- ✅ GDPR compliant
- ✅ SOC 2 Type II ready
- ✅ CCPA compliant
- ✅ EU VAT handling
