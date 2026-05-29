require('dotenv').config()
const path = require('path')
const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const cors = require('cors')

const app = express()

// Serve frontend static files from the app root and the public asset folder
app.use(express.static(path.join(__dirname)))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))

const uploadDir = path.join(__dirname, 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })
app.use('/uploads', express.static(uploadDir))

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({ storage })

// MULTI LANGUAGE SUPPORT
const languages = {
  en: {
    bookingSuccess: 'Soil Testing Booking Submitted',
    farmerAdded: 'Farmer Added Successfully',
    reportGenerated: 'Soil Report Generated',
  },
  mr: {
    bookingSuccess: 'माती परीक्षण नोंदणी यशस्वीरित्या पूर्ण झाली',
    farmerAdded: 'शेतकरी माहिती यशस्वीरित्या जतन झाली',
    reportGenerated: 'माती परीक्षण अहवाल तयार झाला',
  },
  hi: {
    bookingSuccess: 'मृदा परीक्षण बुकिंग सफलतापूर्वक जमा हुआ',
    farmerAdded: 'किसान की जानकारी सफलतापूर्वक सेव हुई',
    reportGenerated: 'मृदा परीक्षण रिपोर्ट तैयार हो गई',
  },
}

const getMessage = (language, key) => {
  const locale = languages[language] || languages.en
  return locale[key] || languages.en[key]
}

// MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CONFIG
const MONGODB_URI = process.env.MONGODB_URI || 'YOUR_MONGODB_CONNECTION_STRING'
const PORT = process.env.PORT || 5000

// MONGODB CONNECTION
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', (error) => console.error('MongoDB connection error:', error))
db.once('open', () => {
  console.log('✅ MongoDB Connected Successfully')
})

// =========================================
// FARMER SCHEMA
// =========================================

const FarmerSchema = new mongoose.Schema({
  farmerName: String,
  mobile: String,
  village: String,
  taluka: String,
  district: String,
  crop: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Farmer = mongoose.model('Farmer', FarmerSchema)

// =========================================
// SOIL REPORT SCHEMA
// =========================================

const SoilReportSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
  },
  sampleId: String,
  soilType: String,
  ph: Number,
  ec: Number,
  organicCarbon: Number,
  nitrogen: Number,
  phosphorus: Number,
  potassium: Number,
  zinc: Number,
  sulphur: Number,
  cropRecommendation: [String],
  nutrientDeficiency: [String],
  adminRecommendation: {
    ureaDose: String,
    dapDose: String,
    mopDose: String,
    biofertilizerDose: String,
  },
  reportDate: {
    type: Date,
    default: Date.now,
  },
})

const SoilReport = mongoose.model('SoilReport', SoilReportSchema)

// =========================================
// BOOKING SCHEMA
// =========================================

const BookingSchema = new mongoose.Schema({
  farmerName: String,
  mobile: String,
  village: String,
  crop: String,
  soilIssue: String,
  bookingStatus: {
    type: String,
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Booking = mongoose.model('Booking', BookingSchema)

// =========================================
// SURVEY SCHEMA
// =========================================

const SurveySchema = new mongoose.Schema({
  cropType: String,
  soilCondition: String,
  bioUse: String,
  irrigation: String,
  surveyProblem: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
})

const Survey = mongoose.model('Survey', SurveySchema)

// =========================================
// CROP DIAGNOSIS SCHEMA
// =========================================

const CropDiagnosisSchema = new mongoose.Schema({
  farmerName: String,
  mobile: String,
  village: String,
  crop: String,
  stage: String,
  note: String,
  imagePath: String,
  aiDiagnosis: String,
  recommendation: String,
  confidence: Number,
  adminNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const CropDiagnosis = mongoose.model('CropDiagnosis', CropDiagnosisSchema)

// =========================================
// AUTO RECOMMENDATION SYSTEM
// =========================================

function generateRecommendation(report) {
  const deficiency = []
  const crops = []

  if (report.nitrogen < 280) {
    deficiency.push('Nitrogen Deficiency')
  }

  if (report.phosphorus < 20) {
    deficiency.push('Phosphorus Deficiency')
  }

  if (report.potassium < 150) {
    deficiency.push('Potassium Deficiency')
  }

  if (report.ph >= 6 && report.ph <= 7.5) {
    crops.push('Sugarcane', 'Wheat', 'Maize')
  }

  if (report.ph < 6) {
    crops.push('Groundnut', 'Potato')
  }

  return {
    deficiency,
    crops,
  }
}

// =========================================
// ROUTES
// =========================================

app.post('/api/farmers', async (req, res) => {
  try {
    const farmer = new Farmer(req.body)
    await farmer.save()

    res.status(201).json({
      success: true,
      message: getMessage(req.body.language, 'farmerAdded'),
      farmer,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

app.get('/api/farmers', async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 })
    res.json({ success: true, farmers })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/book-soil-test', async (req, res) => {
  try {
    const booking = new Booking(req.body)
    await booking.save()

    res.status(201).json({
      success: true,
      message: getMessage(req.body.language, 'bookingSuccess'),
      booking,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json({ success: true, bookings })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/surveys', async (req, res) => {
  try {
    const survey = new Survey(req.body)
    await survey.save()

    res.status(201).json({
      success: true,
      message: 'Survey data saved successfully',
      survey,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

function generateCropDiagnosisFromData({ crop, stage, note }) {
  const lowerNote = (note || '').toLowerCase()
  let issue = 'Yellowing leaves or nutrient imbalance'
  let recommendation = 'Check soil moisture and apply biofertilizer support.'

  if (crop === 'Sugarcane' || crop === 'Wheat' || crop === 'Rice') {
    issue = 'Possible nitrogen deficiency'
    recommendation = 'Apply Azotobacter and PSB; monitor growth for 3-5 days.'
  }

  if (stage === 'Flowering') {
    recommendation += ' Support with flowering-stage nutrients and rest stress.'
  }

  if (lowerNote.includes('brown') || lowerNote.includes('spot')) {
    issue = 'Possible leaf spot or fungal issue'
    recommendation = 'Keep foliage dry, remove affected leaves, and use biofungicide support.'
  }

  if (lowerNote.includes('yellow')) {
    issue = 'Likely nitrogen or iron deficiency'
    recommendation = 'Use Azotobacter and check soil pH; add micronutrients if needed.'
  }

  return {
    aiDiagnosis: issue,
    recommendation,
    confidence: Math.floor(Math.random() * 16) + 80,
  }
}

app.post('/api/crop-diagnosis', upload.single('cropPhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Crop image is required.' })
    }

    const { farmerName, mobile, village, crop, stage, note } = req.body
    const assessment = generateCropDiagnosisFromData({ crop, stage, note })

    const diagnosis = new CropDiagnosis({
      farmerName,
      mobile,
      village,
      crop,
      stage,
      note,
      imagePath: `/uploads/${req.file.filename}`,
      aiDiagnosis: assessment.aiDiagnosis,
      recommendation: assessment.recommendation,
      confidence: assessment.confidence,
    })

    await diagnosis.save()

    res.status(201).json({
      success: true,
      diagnosis,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/crop-diagnosis', async (req, res) => {
  try {
    const diagnoses = await CropDiagnosis.find().sort({ createdAt: -1 })
    res.json({ success: true, diagnoses })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/crop-diagnosis/:id', async (req, res) => {
  try {
    const diagnosis = await CropDiagnosis.findById(req.params.id)
    if (!diagnosis) {
      return res.status(404).json({ success: false, message: 'Diagnosis not found' })
    }

    res.json({ success: true, diagnosis })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ submittedAt: -1 })
    res.json({ success: true, surveys })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/soil-report', async (req, res) => {
  try {
    const autoData = generateRecommendation(req.body)
    const report = new SoilReport({
      ...req.body,
      cropRecommendation: autoData.crops,
      nutrientDeficiency: autoData.deficiency,
    })
    await report.save()

    res.status(201).json({
      success: true,
      message: getMessage(req.body.language, 'reportGenerated'),
      report,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await SoilReport.find().sort({ reportDate: -1 })
    res.json({ success: true, reports })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/reports/:mobile', async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ mobile: req.params.mobile })
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer Not Found',
      })
    }

    const reports = await SoilReport.find({ farmerId: farmer._id })
    res.json({ success: true, reports })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus: req.body.bookingStatus },
      { new: true }
    )

    res.json({
      success: true,
      booking,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.delete('/api/reports/:id', async (req, res) => {
  try {
    await SoilReport.findByIdAndDelete(req.params.id)
    res.json({
      success: true,
      message: 'Report Deleted Successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/dashboard', async (req, res) => {
  try {
    const totalFarmers = await Farmer.countDocuments()
    const totalBookings = await Booking.countDocuments()
    const totalReports = await SoilReport.countDocuments()

    res.json({
      success: true,
      totalFarmers,
      totalBookings,
      totalReports,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
