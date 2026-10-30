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

export enum PaymentStatus {
  CREATED = 'CREATED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  MOCK = 'MOCK',
  RAZORPAY = 'RAZORPAY',
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  OPEN = 'OPEN',
}

export enum GameStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
}

export enum GameSeatStatus {
  HELD = 'HELD',
  CONFIRMED = 'CONFIRMED',
  RELEASED = 'RELEASED',
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
  payments?: Payment[];
  game?: Game | null;
}

export interface Payment {
  id: number;
  paymentReference: string;
  bookingId: number;
  userId: number;
  provider: PaymentProvider;
  orderId: string;
  paymentId?: string | null;
  signature?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  refundId?: string | null;
  refundReason?: string | null;
  idempotencyKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: number;
  bookingId: number;
  creatorId: number;
  courtId: number;
  venueId: number;
  title?: string | null;
  description?: string | null;
  skillLevel: SkillLevel;
  seatsTotal: number;
  seatsTaken: number;
  pricePerSeat: number;
  status: GameStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  seats?: GameSeat[];
  creator?: User;
  court?: Court;
  venue?: Venue;
  booking?: Booking;
}

export interface GameSeat {
  id: number;
  gameId: number;
  userId: number;
  seatNumber: number;
  price: number;
  status: GameSeatStatus;
  holdExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
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

export interface CourtSlotsResponse {
  court: {
    id: number;
    name: string;
    venue: {
      id: number;
      name: string;
      city: TricityCity;
      area: string;
    };
    basePricePerHour: number;
  };
  date: string;
  slots: Slot[];
}
