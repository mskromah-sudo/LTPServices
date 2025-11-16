import { SubscriptionPlan, PlanFeature } from '@/types';

const PLANS: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Free',
    slug: 'free',
    description: 'Perfect for getting started',
    priceMonthly: 0,
    priceAnnual: 0,
    displayOrder: 1,
    isFeatured: false,
    isActive: true,
    features: [
      { id: '1', featureName: 'Dashboard Analytics', isIncluded: true, displayOrder: 1 },
      { id: '2', featureName: 'Up to 100 Products', isIncluded: true, displayOrder: 2 },
      { id: '3', featureName: 'Basic Support', isIncluded: true, displayOrder: 3 },
      { id: '4', featureName: 'Email Support', isIncluded: false, displayOrder: 4 },
      { id: '5', featureName: 'Up to 1,000 Products', isIncluded: false, displayOrder: 5 },
      { id: '6', featureName: 'Advanced Analytics', isIncluded: false, displayOrder: 6 },
      { id: '7', featureName: 'API Access', isIncluded: false, displayOrder: 7 },
      { id: '8', featureName: 'Priority Support', isIncluded: false, displayOrder: 8 },
      { id: '9', featureName: 'Unlimited Products', isIncluded: false, displayOrder: 9 },
      { id: '10', featureName: 'Custom Integrations', isIncluded: false, displayOrder: 10 },
    ],
  },
  {
    id: '2',
    name: 'Starter',
    slug: 'starter',
    description: 'For small businesses just getting started',
    priceMonthly: 29,
    priceAnnual: 290,
    displayOrder: 2,
    isFeatured: false,
    isActive: true,
    features: [
      { id: '11', featureName: 'Dashboard Analytics', isIncluded: true, displayOrder: 1 },
      { id: '12', featureName: 'Up to 100 Products', isIncluded: true, displayOrder: 2 },
      { id: '13', featureName: 'Basic Support', isIncluded: true, displayOrder: 3 },
      { id: '14', featureName: 'Email Support', isIncluded: true, displayOrder: 4 },
      { id: '15', featureName: 'Up to 1,000 Products', isIncluded: true, displayOrder: 5 },
      { id: '16', featureName: 'Advanced Analytics', isIncluded: false, displayOrder: 6 },
      { id: '17', featureName: 'API Access', isIncluded: false, displayOrder: 7 },
      { id: '18', featureName: 'Priority Support', isIncluded: false, displayOrder: 8 },
      { id: '19', featureName: 'Unlimited Products', isIncluded: false, displayOrder: 9 },
      { id: '20', featureName: 'Custom Integrations', isIncluded: false, displayOrder: 10 },
    ],
  },
  {
    id: '3',
    name: 'Professional',
    slug: 'professional',
    description: 'For growing businesses',
    priceMonthly: 99,
    priceAnnual: 990,
    displayOrder: 3,
    isFeatured: true,
    isActive: true,
    features: [
      { id: '21', featureName: 'Dashboard Analytics', isIncluded: true, displayOrder: 1 },
      { id: '22', featureName: 'Up to 100 Products', isIncluded: true, displayOrder: 2 },
      { id: '23', featureName: 'Basic Support', isIncluded: true, displayOrder: 3 },
      { id: '24', featureName: 'Email Support', isIncluded: true, displayOrder: 4 },
      { id: '25', featureName: 'Up to 1,000 Products', isIncluded: true, displayOrder: 5 },
      { id: '26', featureName: 'Advanced Analytics', isIncluded: true, displayOrder: 6 },
      { id: '27', featureName: 'API Access', isIncluded: true, displayOrder: 7 },
      { id: '28', featureName: 'Priority Support', isIncluded: true, displayOrder: 8 },
      { id: '29', featureName: 'Unlimited Products', isIncluded: false, displayOrder: 9 },
      { id: '30', featureName: 'Custom Integrations', isIncluded: false, displayOrder: 10 },
    ],
  },
  {
    id: '4',
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'For large organizations with custom needs',
    priceMonthly: 0,
    displayOrder: 4,
    isFeatured: false,
    isActive: true,
    features: [
      { id: '31', featureName: 'Dashboard Analytics', isIncluded: true, displayOrder: 1 },
      { id: '32', featureName: 'Up to 100 Products', isIncluded: true, displayOrder: 2 },
      { id: '33', featureName: 'Basic Support', isIncluded: true, displayOrder: 3 },
      { id: '34', featureName: 'Email Support', isIncluded: true, displayOrder: 4 },
      { id: '35', featureName: 'Up to 1,000 Products', isIncluded: true, displayOrder: 5 },
      { id: '36', featureName: 'Advanced Analytics', isIncluded: true, displayOrder: 6 },
      { id: '37', featureName: 'API Access', isIncluded: true, displayOrder: 7 },
      { id: '38', featureName: 'Priority Support', isIncluded: true, displayOrder: 8 },
      { id: '39', featureName: 'Unlimited Products', isIncluded: true, displayOrder: 9 },
      { id: '40', featureName: 'Custom Integrations', isIncluded: true, displayOrder: 10 },
    ],
  },
];

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  return PLANS;
}

export async function getSubscriptionPlanBySlug(slug: string): Promise<SubscriptionPlan | null> {
  return PLANS.find(p => p.slug === slug) || null;
}

export async function getSubscriptionPlanById(id: string): Promise<SubscriptionPlan | null> {
  return PLANS.find(p => p.id === id) || null;
}

export function calculateAnnualDiscount(monthlyPrice: number, annualPrice: number): number {
  return Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100);
}
