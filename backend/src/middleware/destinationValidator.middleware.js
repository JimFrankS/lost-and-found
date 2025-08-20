import expressAsyncHandler from "express-async-handler";

const allowedMap = {
  "harare": ["harare"],
  "bulawayo": ["bulawayo"],
  "manicaland": ["buhera", "chimanimani", "chipinge", "makoni", "mutare", "nyanga", "mutasa"],
  "mashonaland east": ["chokomba", "goromonzi", "marondera", "murehwa", "mutoko", "seke", "uzumba maramba pfungwe"],
  "mashonaland west": [ "chegutu", "chinhoyi", "hurungwe", "kariba", "makonde", "mhondoro ngezi", "zvimba"],
  "masvingo": ["bikita", "chiredzi", "gutu", "masvingo", "mwenezi", "zaka"],
  "matabeleland north": [ "binga", "buluwayo", "hwange", "lupane", "nkayi", "tsholotsho"],
  "matabeleland south": [ "gwanda", "insiza", "matobo","umzingwane", "beitbridge" ],
  "midlands": [ "gweru", "kwekwe", "lower gweru", "mkoba", "mberengwa", "shurugwi", "zvishavane" ],
  "mashonaland central": [ "bindura", "guruve", "mt. darwin", "muzarabani", "shamva" ]
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