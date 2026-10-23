import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;
const options = { timestamps: true, versionKey: false, strict: 'throw' };

const roomSchema = new Schema({
  number: { type: String, required: true, trim: true, unique: true, maxlength: 30 },
  type: { type: String, required: true, enum: ['Single Sharing', 'Double Sharing', 'Triple Sharing', 'Dormitory'] },
  capacity: { type: Number, required: true, min: 1, max: 100 },
  occupied: { type: Number, required: true, min: 0, default: 0 },
  monthlyRent: { type: Number, required: true, min: 0, default: 0 },
  status: { type: String, enum: ['Vacant', 'Available', 'Full'], default: 'Vacant' },
}, options);
roomSchema.pre('validate', function validateOccupancy(next) {
  if (this.occupied > this.capacity) this.invalidate('occupied', 'Occupied beds cannot exceed room capacity.');
  this.status = this.occupied >= this.capacity ? 'Full' : this.occupied === 0 ? 'Vacant' : 'Available';
  next();
});

const guestSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true, maxlength: 25 },
  room: { type: String, required: true, trim: true, maxlength: 30 },
  checkIn: { type: String, required: true },
  checkOut: { type: String, default: '' },
  monthlyRent: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Active', 'Checked Out'], default: 'Active' },
}, options);

const paymentSchema = new Schema({
  guest: { type: String, required: true, trim: true, maxlength: 120 },
  room: { type: String, required: true, trim: true, maxlength: 30 },
  amount: { type: Number, required: true, min: 1 },
  dueDate: { type: String, required: true },
  paymentDate: { type: String, default: '' },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
}, options);

const staffSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  role: { type: String, required: true, enum: ['Manager', 'Cook', 'Helper', 'Housekeeping', 'Security', 'Maintenance', 'Reception'] },
  phone: { type: String, required: true, trim: true, maxlength: 25 },
  shift: { type: String, required: true, enum: ['Morning', 'Day', 'Evening', 'Night', 'Flexible'] },
  status: { type: String, required: true, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
}, options);

const attendanceSchema = new Schema({
  staff: { type: String, required: true, trim: true, maxlength: 120 },
  date: { type: String, required: true },
  status: { type: String, required: true, enum: ['Present', 'Absent', 'Half Day', 'Leave'] },
}, options);
attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

const maintenanceSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  room: { type: String, required: true, trim: true, maxlength: 60 },
  priority: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, required: true, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
  reportedDate: { type: String, required: true },
  notes: { type: String, default: '', maxlength: 2000 },
}, options);

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true, versionKey: false });

export const Room = models.Room || model('Room', roomSchema);
export const Guest = models.Guest || model('Guest', guestSchema);
export const Payment = models.Payment || model('Payment', paymentSchema);
export const Staff = models.Staff || model('Staff', staffSchema);
export const Attendance = models.Attendance || model('Attendance', attendanceSchema);
export const Maintenance = models.Maintenance || model('Maintenance', maintenanceSchema);
export const User = models.User || model('User', userSchema);

export const resourceModels = {
  rooms: Room,
  guests: Guest,
  payments: Payment,
  staff: Staff,
  attendance: Attendance,
  maintenance: Maintenance,
};
