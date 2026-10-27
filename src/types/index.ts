export enum Role {
  PLAYER = 'PLAYER',
  HOST = 'HOST',
  ADMIN = 'ADMIN',
}

export enum TricityCity {
  CHANDIGARH = 'CHANDIGARH',
  MOHALI = 'MOHALI',
  PANCHKULA = 'PANCHKULA',
  ZIRAKPUR = 'ZIRAKPUR',
}

export enum CourtSurface {
  ACRYLIC_HARD = 'ACRYLIC_HARD',
  CUSHIONED_ACRYLIC = 'CUSHIONED_ACRYLIC',
  SYNTHETIC_TURF = 'SYNTHETIC_TURF',
  WOODEN = 'WOODEN',
  CONCRETE = 'CONCRETE',
}

export enum CourtType {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
  COVERED_ROOFTOP = 'COVERED_ROOFTOP',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  HELD = 'HELD',
  BOOKED = 'BOOKED',
  BLOCKED = 'BLOCKED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VenueImage {
  id: number;
  venueId: number;
  url: string;
  isCover: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Court {
  id: number;
  venueId: number;
  name: string;
  surface: CourtSurface;
  type: CourtType;
  basePricePerHour: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  schedules?: Schedule[];
}

export interface Schedule {
  id: number;
  courtId: number;
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  slotDurationMinutes: number;
  priceOverride?: number | null;
}

export interface Slot {
  id: number;
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: SlotStatus;
  heldBy?: number | null;
  holdExpiresAt?: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: number;
  hostId: number;
  name: string;
  slug: string;
  description?: string | null;
  city: TricityCity;
  area: string;
  address: string;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  hasLighting: boolean;
  hasEquipmentRental: boolean;
  hasParking: boolean;
  hasWashroom: boolean;
  hasDrinkingWater: boolean;
  contactPhone?: string | null;
  whatsappNumber?: string | null;
  contactEmail?: string | null;
  cancellationCutoffHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: VenueImage[];
  courts: Court[];
}

export interface Booking {
  id: number;
  bookingReference: string;
  userId: number;
  slotId: number;
  courtId: number;
  venueId: number;
  status: BookingStatus;
  totalPrice: number;
  cancellationCutoff?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  idempotencyKey?: string | null;
  createdAt: string;
  updatedAt: string;
  slot?: Slot;
  court?: Court;
  venue?: Venue;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface VenueQueryParams {
  city?: TricityCity;
  area?: string;
  hasLighting?: boolean;
  hasEquipmentRental?: boolean;
  hasParking?: boolean;
  hasWashroom?: boolean;
  hasDrinkingWater?: boolean;
  search?: string;
}

export interface HoldSlotResponse {
  slot: Slot;
  expiresInSeconds: number;
  holdExpiresAt: string;
}
