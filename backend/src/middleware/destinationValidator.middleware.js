import expressAsyncHandler from "express-async-handler";

const allowedMap = {
  "harare": ["harare", "chitungwiza", "epworth"],
  "bulawayo": ["bulawayo"],
  "manicaland": ["buhera", "chimanimani", "chipinge", "makoni", "mutare", "nyanga", "mutasa"],
  "mashonaland east": ["chikomba", "goromonzi", "marondera", "mudzi", "murehwa", "mutoko", "seke", "uzumba maramba pfungwe", "wedza"],
  "mashonaland west": ["chegutu", "hurungwe", "kariba", "makonde", "mhondoro ngezi", "sanyati", "zvimba"],
  "masvingo": ["bikita", "chiredzi", "chivi", "gutu", "masvingo", "mwenezi", "zaka"],
  "matabeleland north": ["binga", "bubi", "hwange", "lupane", "nkayi", "tsholotsho", "umguza"],
  "matabeleland south": ["beitbridge", "bulilima", "gwanda", "insiza", "mangwe", "matobo", "umzingwane"],
  "midlands": ["chirumhanzu", "gokwe north", "gokwe south", "gweru", "kwekwe", "mberengwa", "shurugwi", "zvishavane"],
  "mashonaland central": ["bindura", "guruve", "mazowe", "mbire", "mount darwin", "muzarabani", "rushinga", "shamva"]
};

const allowedProvinces = Object.keys(allowedMap);

export const provinceValidator = expressAsyncHandler(async (req, res, next) => {
  // Prefer body, fallback to query for GET requests
  const source = req.body && Object.keys(req.body).length ? req.body : req.query;
  const { destinationProvince, destinationDistrict } = source || {};

  // Province validation and normalization (case-insensitive)
  if (!destinationProvince || typeof destinationProvince !== "string" || destinationProvince.trim() === "") {
    return res.status(400).json({ error: "Destination province is required and must be a non-empty string." });
  }
  const normalizedProvince = destinationProvince.trim().toLowerCase();

  if (!allowedProvinces.includes(normalizedProvince)) {
    return res.status(400).json({ error: `Invalid destination province. Allowed values are: ${allowedProvinces.map(p => p[0].toUpperCase() + p.slice(1)).join(', ')}.` });
  }

  // Always require and validate district
  const provinceDistricts = allowedMap[normalizedProvince];
  if (!destinationDistrict || typeof destinationDistrict !== "string" || destinationDistrict.trim() === "") {
    return res.status(400).json({ error: `Destination district is required for ${normalizedProvince[0].toUpperCase() + normalizedProvince.slice(1)} province.` });
  }
  const normalizedDistrict = destinationDistrict.trim().toLowerCase();
  if (!provinceDistricts.includes(normalizedDistrict)) {
    return res.status(400).json({ error: `Invalid destination district for ${normalizedProvince[0].toUpperCase() + normalizedProvince.slice(1)} province. Allowed districts are: ${provinceDistricts.map(pd => pd[0].toUpperCase() + pd.slice(1)).join(', ')}.` });
  }

  // Set normalized values back to the correct source
  source.destinationDistrict = normalizedDistrict;
  source.destinationProvince = normalizedProvince;
  next();
});