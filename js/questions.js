/*
 * Radiology MCQ Trainer — question bank
 * ------------------------------------------------------------------
 * Original educational questions written for this app. They contain no
 * citations by design. Review every item against current guidelines and
 * standard FRCR texts before relying on it; not for clinical decisions.
 *
 * Schema for each question:
 *   id            unique string, e.g. "cns-04"
 *   topic         one of the ids in RAD_TOPICS
 *   difficulty    "core" | "intermediate" | "advanced"
 *   stem          question text
 *   options       exactly four answer strings
 *   answer        index (0–3) of the correct option
 *   explanation   why the answer is right and the others are wrong
 *   learningPoint one take-home message
 */
window.RAD_TOPICS = [
  { id: 'cns', label: 'CNS' },
  { id: 'chest', label: 'Chest' },
  { id: 'abdomen', label: 'Abdomen' },
  { id: 'msk', label: 'MSK' },
  { id: 'gu', label: 'GU' },
  { id: 'physics', label: 'Physics' }
];

window.RAD_QUESTIONS = [
  /* ----------------------------- CNS ----------------------------- */
  {
    id: 'cns-01',
    topic: 'cns',
    difficulty: 'core',
    stem: 'A 68-year-old presents 2 hours after sudden-onset right hemiparesis. Non-contrast CT is normal. On MRI, which combination of findings in the left MCA territory is most consistent with a hyperacute infarct?',
    options: [
      'High signal on DWI with low ADC values',
      'High signal on DWI with high ADC values',
      'Low signal on DWI with low ADC values',
      'Marked FLAIR hyperintensity with normal DWI'
    ],
    answer: 0,
    explanation: 'Cytotoxic oedema restricts water diffusion within minutes of arterial occlusion, giving high DWI signal with a corresponding low ADC. High DWI with high ADC indicates T2 shine-through (e.g. later subacute infarct or vasogenic oedema), not true restriction. FLAIR change typically lags behind DWI by several hours, so marked FLAIR hyperintensity with a normal DWI does not fit a hyperacute infarct.',
    learningPoint: 'Always confirm DWI hyperintensity on the ADC map — true restriction is dark on ADC. A DWI-positive, FLAIR-negative lesion (DWI–FLAIR mismatch) suggests an infarct roughly 4.5 hours old or less.'
  },
  {
    id: 'cns-02',
    topic: 'cns',
    difficulty: 'intermediate',
    stem: 'An intraparenchymal haematoma is hyperintense on T1-weighted images and hypointense on T2-weighted images. Which stage and dominant blood product does this pattern best represent?',
    options: [
      'Hyperacute — intracellular oxyhaemoglobin',
      'Acute — intracellular deoxyhaemoglobin',
      'Early subacute — intracellular methaemoglobin',
      'Late subacute — extracellular methaemoglobin'
    ],
    answer: 2,
    explanation: 'Methaemoglobin shortens T1, so subacute blood is bright on T1. While it is still inside intact red cells (early subacute, roughly days 3–7) it also causes T2 shortening, so the clot is dark on T2. After red cell lysis (late subacute), extracellular methaemoglobin is bright on both T1 and T2. Hyperacute blood (oxyhaemoglobin) is T1 iso/hypo and T2 bright; acute blood (deoxyhaemoglobin) is T1 iso/hypo and T2 dark.',
    learningPoint: 'Approximate T1/T2 pattern by stage: hyperacute iso/bright → acute iso/dark → early subacute bright/dark → late subacute bright/bright → chronic dark rim (haemosiderin) on both. Timings are approximate and vary with field strength and clot size.'
  },
  {
    id: 'cns-03',
    topic: 'cns',
    difficulty: 'core',
    stem: 'A 29-year-old woman has an episode of optic neuritis. Sagittal FLAIR MRI shows ovoid lesions radiating perpendicular from the lateral ventricles and involving the callososeptal interface. Which diagnosis is most likely?',
    options: [
      'Multiple sclerosis',
      'Chronic small vessel ischaemic disease',
      'CADASIL',
      'Neurosarcoidosis'
    ],
    answer: 0,
    explanation: 'Ovoid periventricular lesions perpendicular to the ventricles ("Dawson’s fingers") reflect perivenular inflammation along the medullary veins and are characteristic of MS, as is involvement of the callososeptal interface. Small vessel ischaemic disease tends to spare the corpus callosum and favours deep white matter and basal ganglia in older patients. CADASIL characteristically involves the anterior temporal poles and external capsules. Neurosarcoidosis typically shows leptomeningeal or dural enhancement, often basal.',
    learningPoint: 'Typical MS lesion sites: periventricular, juxtacortical/cortical, infratentorial and spinal cord — dissemination in space and time is assessed with the current McDonald criteria. A central vein within lesions on susceptibility-weighted imaging supports MS.'
  },

  /* ---------------------------- Chest ---------------------------- */
  {
    id: 'chest-01',
    topic: 'chest',
    difficulty: 'core',
    stem: 'A frontal chest radiograph shows consolidation that obscures the right heart border, while the right hemidiaphragm remains clearly defined. Which lobe is most likely involved?',
    options: [
      'Right upper lobe',
      'Right middle lobe',
      'Right lower lobe',
      'Azygos lobe'
    ],
    answer: 1,
    explanation: 'Silhouette sign: a normal border is lost when fluid or soft-tissue density lies in direct contact with it. The right heart border is in contact with the medial segment of the right middle lobe. The right lower lobe lies posteriorly against the hemidiaphragm, so lower lobe consolidation obscures the diaphragm but usually preserves the heart border. The azygos lobe is an anatomical variant in the upper zone.',
    learningPoint: 'Right heart border → right middle lobe; left heart border → lingula; hemidiaphragm → lower lobe; aortic knuckle → left upper lobe (apicoposterior segment).'
  },
  {
    id: 'chest-02',
    topic: 'chest',
    difficulty: 'intermediate',
    stem: 'On a supine portable chest radiograph of a ventilated ICU patient, the left costophrenic angle appears abnormally deep and lucent, extending inferiorly. What does this most likely indicate?',
    options: [
      'Left pleural effusion',
      'Left pneumothorax',
      'Left lower lobe collapse',
      'Hyperinflation from emphysema'
    ],
    answer: 1,
    explanation: 'In a supine patient, pleural air collects anteriorly and inferiorly rather than at the apex, so the classic apical visceral pleural line may be absent. Air in the lateral costophrenic recess produces the deep sulcus sign. An effusion layers posteriorly and causes hazy increased density; lobar collapse increases density; emphysema flattens both hemidiaphragms rather than producing a unilateral deep lucent sulcus.',
    learningPoint: 'Supine films can hide a sizeable pneumothorax — look for the deep sulcus sign, an unusually sharp heart border or hemidiaphragm, and increased basal lucency. In a ventilated patient a pneumothorax can rapidly progress to tension.'
  },
  {
    id: 'chest-03',
    topic: 'chest',
    difficulty: 'core',
    stem: 'A chest radiograph shows multiple short (1–2 cm), thin horizontal lines at the lung bases, perpendicular to and reaching the lateral pleural surface. What do these lines represent anatomically?',
    options: [
      'Thickened interlobular septa',
      'Thickened bronchial walls seen end-on',
      'Plate-like (discoid) atelectasis',
      'Calcified pleural plaques'
    ],
    answer: 0,
    explanation: 'These are Kerley B lines: thickened interlobular septa at the periphery of secondary pulmonary lobules, most often from interstitial oedema due to raised pulmonary venous pressure, but also seen in lymphangitis carcinomatosa and other interstitial processes. Bronchial wall thickening gives peribronchial cuffing and ring shadows; discoid atelectasis gives longer, fewer linear opacities; pleural plaques are pleural-based and typically spare the costophrenic angles.',
    learningPoint: 'Interstitial oedema on CXR: Kerley B lines, peribronchial cuffing, upper lobe venous diversion (on an erect film) and fluid in the fissures. Asymmetric or nodular septal thickening should raise the possibility of lymphangitis carcinomatosa.'
  },

  /* --------------------------- Abdomen --------------------------- */
  {
    id: 'abdomen-01',
    topic: 'abdomen',
    difficulty: 'intermediate',
    stem: 'A 58-year-old with cirrhosis has a 2.5 cm liver observation on multiphase CT. Which enhancement pattern is most characteristic of hepatocellular carcinoma?',
    options: [
      'Peripheral nodular discontinuous enhancement with progressive centripetal fill-in',
      'Non-rim arterial phase hyperenhancement with washout in the portal venous or delayed phase',
      'Rim arterial enhancement with progressive central enhancement',
      'Homogeneous arterial enhancement with a central scar that enhances on delayed images'
    ],
    answer: 1,
    explanation: 'HCC is supplied mainly by hepatic arteries, giving non-rim arterial phase hyperenhancement, then appears hypoattenuating relative to liver in later phases ("washout"), often with an enhancing capsule. Peripheral nodular discontinuous enhancement with fill-in is typical of haemangioma. Rim arterial enhancement with progressive central enhancement favours intrahepatic cholangiocarcinoma (a LI-RADS LR-M feature). A central scar enhancing on delayed images suggests focal nodular hyperplasia.',
    learningPoint: 'LI-RADS major features: non-rim APHE, non-peripheral washout, enhancing capsule, size and threshold growth. Imaging-only diagnosis of HCC is valid only in the at-risk population (e.g. cirrhosis, chronic hepatitis B).'
  },
  {
    id: 'abdomen-02',
    topic: 'abdomen',
    difficulty: 'intermediate',
    stem: 'A 10-day-old neonate presents with bilious vomiting. On abdominal ultrasound, which finding suggests intestinal malrotation?',
    options: [
      'SMV lying to the right of the SMA',
      'SMV lying to the left of the SMA',
      'Aorta lying to the left of the IVC',
      'Pyloric muscle thickness greater than 3 mm'
    ],
    answer: 1,
    explanation: 'Normally the SMV lies to the right of the SMA. Reversal (SMV to the left of the SMA) suggests malrotation, and a "whirlpool" of the SMV and mesentery wrapping around the SMA indicates midgut volvulus. A normal relationship does not exclude malrotation. The aorta normally lies to the left of the IVC. Pyloric muscle thickening (>3 mm) indicates hypertrophic pyloric stenosis, which causes non-bilious vomiting, typically at 2–8 weeks.',
    learningPoint: 'Bilious vomiting in a neonate is midgut volvulus until proven otherwise — a surgical emergency. On an upper GI contrast study the duodenojejunal flexure should lie to the left of the left vertebral pedicle at the level of the duodenal bulb.'
  },
  {
    id: 'abdomen-03',
    topic: 'abdomen',
    difficulty: 'core',
    stem: 'On a supine abdominal radiograph, both the inner (luminal) and outer (serosal) surfaces of a loop of small bowel wall are clearly visible. Which sign is this and what does it indicate?',
    options: [
      'Rigler’s sign — pneumoperitoneum',
      'Coffee bean sign — sigmoid volvulus',
      'Chilaiditi sign — colonic interposition between liver and diaphragm',
      'Football sign — large pneumoperitoneum outlining the peritoneal cavity'
    ],
    answer: 0,
    explanation: 'Gas on both sides of the bowel wall (Rigler’s or double-wall sign) means free intraperitoneal gas. The coffee bean sign is the dilated, folded sigmoid loop of sigmoid volvulus. Chilaiditi sign is colon interposed between liver and diaphragm and can mimic free air. The football sign is also a sign of pneumoperitoneum, but it describes a large oval lucency outlining the peritoneal cavity, not visible bowel walls.',
    learningPoint: 'An erect CXR detects small volumes of free air under the diaphragm. On supine films look for Rigler’s sign, the football sign, the falciform ligament sign and triangular gas between loops. CT is the most sensitive test.'
  },

  /* ----------------------------- MSK ----------------------------- */
  {
    id: 'msk-01',
    topic: 'msk',
    difficulty: 'core',
    stem: 'A 12-year-old has a distal radius fracture. The fracture line passes through the physis and exits through the metaphysis, sparing the epiphysis. What is the Salter–Harris type?',
    options: ['Type I', 'Type II', 'Type III', 'Type IV'],
    answer: 1,
    explanation: 'Type I runs through the physis only. Type II runs through the physis and metaphysis (the metaphyseal fragment is the Thurston Holland fragment) and is the most common type. Type III runs through the physis and epiphysis (intra-articular). Type IV crosses the metaphysis, physis and epiphysis. Type V is a crush injury of the physis.',
    learningPoint: 'Mnemonic SALTR: Straight across (I), Above (II), Lower (III), Through (IV), Rammed (V). Types III and IV are intra-articular and carry a higher risk of growth disturbance; type V is often recognised only in retrospect.'
  },
  {
    id: 'msk-02',
    topic: 'msk',
    difficulty: 'core',
    stem: 'A 6-year-old falls on an outstretched hand. A lateral elbow radiograph shows an elevated anterior fat pad and a visible posterior fat pad, but no fracture line. What is the most likely underlying injury?',
    options: [
      'Occult supracondylar fracture',
      'Radial head fracture',
      'Pulled elbow (radial head subluxation)',
      'Normal variant — no injury'
    ],
    answer: 0,
    explanation: 'A visible posterior fat pad is never normal: it indicates a joint effusion, which after trauma implies haemarthrosis. In children the most common occult fracture is supracondylar; in adults it is a radial head fracture. Pulled elbow does not usually cause an effusion, and its radiographs are normal. The anterior fat pad can be normally visible, but an elevated "sail sign" is abnormal.',
    learningPoint: 'On the lateral elbow, check that the anterior humeral line intersects the capitellum (middle third in older children) and that the radiocapitellar line passes through the capitellum on every view. Know the CRITOL ossification order: Capitellum, Radial head, Internal (medial) epicondyle, Trochlea, Olecranon, Lateral epicondyle.'
  },
  {
    id: 'msk-03',
    topic: 'msk',
    difficulty: 'core',
    stem: 'Which scaphoid fracture location carries the highest risk of avascular necrosis?',
    options: ['Distal pole', 'Tubercle', 'Waist', 'Proximal pole'],
    answer: 3,
    explanation: 'Most of the scaphoid’s blood supply is retrograde, from radial artery branches entering at the dorsal ridge and distal pole. Proximal pole fractures (and to a lesser extent waist fractures) can cut the proximal fragment off from its supply, leading to avascular necrosis and non-union. Tubercle and distal pole fractures usually heal well.',
    learningPoint: 'Scaphoid fractures can be occult on radiographs. If clinical suspicion is high and radiographs are normal, MRI (or CT) gives an early diagnosis. Proximal pole AVN appears as sclerosis on radiographs and low T1 signal on MRI.'
  },

  /* ------------------------------ GU ----------------------------- */
  {
    id: 'gu-01',
    topic: 'gu',
    difficulty: 'advanced',
    stem: 'An incidental, well-defined, homogeneous renal mass measures 75 HU on unenhanced CT. Using the Bosniak classification (version 2019), how is it categorised?',
    options: ['Bosniak I', 'Bosniak II', 'Bosniak IIF', 'Bosniak III'],
    answer: 1,
    explanation: 'In Bosniak v2019, a homogeneous mass measuring ≥70 HU on unenhanced CT is class II (a benign haemorrhagic or proteinaceous cyst) and needs no further imaging. Class I is a simple cyst: thin (≤2 mm) smooth wall, homogeneous simple fluid (−9 to 20 HU), with no septa, calcification or enhancement. Class IIF covers minimally thickened smooth walls/septa or multiple thin septa and needs follow-up. Class III has thick or irregular enhancing walls or septa.',
    learningPoint: 'Bosniak I and II are benign and need no follow-up; IIF needs imaging surveillance; III and IV (IV has enhancing nodules) are treated as potentially malignant. Version 2019 also includes MRI criteria.'
  },
  {
    id: 'gu-02',
    topic: 'gu',
    difficulty: 'core',
    stem: 'A 4 cm solid renal mass contains regions measuring −40 HU on unenhanced CT. There is no calcification. What is the most likely diagnosis?',
    options: [
      'Angiomyolipoma',
      'Clear cell renal cell carcinoma',
      'Oncocytoma',
      'Renal lymphoma'
    ],
    answer: 0,
    explanation: 'Macroscopic fat (clearly negative attenuation, e.g. below about −10 HU) in a renal mass without calcification is virtually diagnostic of angiomyolipoma. RCC very rarely contains macroscopic fat, usually alongside calcification or from engulfed sinus or perirenal fat. Oncocytoma may have a central scar but no fat; lymphoma is typically homogeneous, hypoenhancing and fat-free.',
    learningPoint: 'Multiple bilateral AMLs suggest tuberous sclerosis complex. Larger AMLs (classically >4 cm) and those with aneurysms are at risk of haemorrhage (Wunderlich syndrome). Fat-poor AMLs cannot be reliably separated from RCC on imaging.'
  },
  {
    id: 'gu-03',
    topic: 'gu',
    difficulty: 'core',
    stem: 'A 14-year-old boy has had sudden, severe left testicular pain for 3 hours. Ultrasound shows an enlarged, heterogeneous left testis with absent intratesticular colour Doppler flow and a spiral twist of the spermatic cord above the testis. What is the most likely diagnosis?',
    options: [
      'Epididymo-orchitis',
      'Testicular torsion',
      'Torsion of the appendix testis',
      'Varicocele'
    ],
    answer: 1,
    explanation: 'Absent or reduced intratesticular flow compared with the normal side, together with a twisted spermatic cord ("whirlpool sign"), indicates testicular torsion. Epididymo-orchitis shows increased (hyperaemic) flow in an enlarged epididymis or testis. Torsion of the appendix testis gives a small avascular nodule beside the testis, with normal testicular flow. A varicocele is dilated pampiniform plexus veins, usually painless or a dull ache.',
    learningPoint: 'Torsion is a clinical diagnosis and a surgical emergency — imaging must not delay exploration. Normal Doppler flow does not exclude partial or intermittent torsion. Salvage rates fall with time and are highest within about 6 hours.'
  },

  /* --------------------------- Physics --------------------------- */
  {
    id: 'physics-01',
    topic: 'physics',
    difficulty: 'core',
    stem: 'The dose rate 1 m from a point source of radiation is 40 µGy/h. Ignoring attenuation in air, what is the dose rate at 2 m?',
    options: ['20 µGy/h', '10 µGy/h', '5 µGy/h', '80 µGy/h'],
    answer: 1,
    explanation: 'Intensity from a point source is inversely proportional to the square of the distance: I₂ = I₁ × (d₁/d₂)². Doubling the distance cuts the dose rate to one quarter: 40 × (1/2)² = 10 µGy/h. 20 µGy/h would assume a linear (1/d) relationship.',
    learningPoint: 'Time, distance and shielding are the three principles of external radiation protection; distance is often the simplest and most effective. The inverse square law strictly applies only to a point source in a non-attenuating medium.'
  },
  {
    id: 'physics-02',
    topic: 'physics',
    difficulty: 'core',
    stem: 'What is the approximate Larmor (precessional) frequency of hydrogen nuclei in a 3.0 T MRI scanner?',
    options: ['42.6 MHz', '63.9 MHz', '127.7 MHz', '255.5 MHz'],
    answer: 2,
    explanation: 'Larmor equation: f₀ = (γ/2π) × B₀. For ¹H, γ/2π ≈ 42.58 MHz/T, so at 3.0 T: 42.58 × 3.0 ≈ 127.7 MHz. 42.6 MHz corresponds to 1.0 T and 63.9 MHz to 1.5 T.',
    learningPoint: 'The RF excitation pulse must match the Larmor frequency for resonance. The fat–water frequency difference (≈3.5 ppm: about 220 Hz at 1.5 T and 440 Hz at 3 T) underlies chemical shift artefact and spectral fat suppression.'
  },
  {
    id: 'physics-03',
    topic: 'physics',
    difficulty: 'intermediate',
    stem: 'Which dosimetric quantity uses tissue weighting factors to estimate whole-body stochastic risk from a non-uniform exposure, and what is its SI unit?',
    options: [
      'Absorbed dose — gray (Gy)',
      'Equivalent dose — sievert (Sv)',
      'Effective dose — sievert (Sv)',
      'Air kerma — gray (Gy)'
    ],
    answer: 2,
    explanation: 'Absorbed dose is energy deposited per unit mass (J/kg = Gy). Equivalent dose applies a radiation weighting factor (w_R = 1 for X-rays) to the absorbed dose in an organ (Sv). Effective dose sums organ equivalent doses multiplied by tissue weighting factors (w_T) to give one risk-related quantity (Sv). Air kerma is the kinetic energy released per unit mass of air (Gy), used for calibration and output measurement.',
    learningPoint: 'Effective dose is meant for radiation protection of populations, not for estimating an individual patient’s risk. Approximate orders of magnitude: chest radiograph ≈ 0.02 mSv; CT abdomen–pelvis ≈ 7–10 mSv; UK average natural background ≈ 2.7 mSv per year. Values vary with technique and protocol.'
  }
];
