export interface SampleDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultAudience: string;
  defaultReadingLevel: string;
  defaultTone: string;
  defaultFormat: string;
  content: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'renewable-grid-paper',
    title: 'Research Paper: Scalability & Economics of Next-Gen Renewable Microgrids',
    category: 'Energy & Engineering',
    description: 'Peer-reviewed style paper analyzing grid parity, battery energy storage systems (BESS), and levelized cost of energy (LCOE).',
    defaultAudience: 'High School Science Students',
    defaultReadingLevel: 'Grade 10 (Accessible)',
    defaultTone: 'Engaging & Educational',
    defaultFormat: 'Simplified Explanation',
    content: `Title: Empirical Evaluation of Utility-Scale Renewable Microgrids and Distributed Storage Economics
Author: Dr. Elena Rostova, Center for Sustainable Grid Dynamics
Date: October 2024

1. Abstract & Executive Context
The transition from legacy centralized hydrocarbon generation to distributed renewable microgrids has reached an economic inflection point. Between 2018 and 2024, the Levelized Cost of Energy (LCOE) for utility-scale bifacial photovoltaic (PV) systems decreased by 41.3%, falling from $0.072/kWh to $0.042/kWh in temperate latitudes. Concurrently, grid-scale Lithium Iron Phosphate (LiFePO4) Battery Energy Storage Systems (BESS) experienced an average capital expenditure decline from $380/kWh of installed storage capacity to $185/kWh. 

2. Technical Architecture and System Dynamics
In this longitudinal 24-month field study conducted across six regional testbed nodes in the American Southwest and Northern Europe (encompassing 420 megawatts of peak capacity), microgrids operating under decentralized peer-to-peer dispatch protocols exhibited a 99.982% uptime reliability rating compared to the regional baseline grid uptime of 99.890%. 
The primary technical bottleneck identified was not instantaneous generation capacity, but sub-second frequency regulation during steep solar irradiance drop-offs (the so-called "cloud transient phenomenon"). When irradiance fell by >70% within a 45-second window, traditional spinning reserves required an average latency of 180 seconds to spin up, inducing transient frequency fluctuations of ±0.42 Hz. In contrast, inverter-based grid-forming (GFM) virtual synchronous machines coupled with BESS arrested frequency drops within 12 milliseconds, maintaining system stability within ±0.05 Hz.

3. Economic Findings and Levelized Grid Parity
Financial modeling over an assumed 25-year operational lifecycle indicates that microgrids incorporating at least 4 hours of duration-rated storage achieve positive internal rates of return (IRR) of 11.4% without relying on state-level feed-in tariffs. Capital payback periods dropped from 14.2 years in 2019 to 6.8 years in 2024. However, balance-of-system (BOS) soft costs, particularly local municipal permitting delays and interconnection queue backlogs (averaging 19.4 months across investigated transmission operators), constitute 31% of total project expenditures.

4. Conclusion and Policy Recommendations
Distributed microgrids with grid-forming inverters and LiFePO4 chemistry are technically mature and commercially self-sustaining. Policy intervention must shift from direct hardware subsidies toward bureaucratic streamlining of transmission interconnection standards and dynamic time-of-use tariff structures.`,
  },
  {
    id: 'crispr-biomedical-study',
    title: 'Biomedical Clinical Report: CRISPR-Cas9 Therapy in Sickle Cell Disease',
    category: 'Medicine & Genetics',
    description: 'Clinical trial evaluation of ex-vivo hematopoietic stem cell gene editing targeting the BCL11A erythroid enhancer.',
    defaultAudience: 'General Public / Patients & Families',
    defaultReadingLevel: 'Grade 8 (Plain Language)',
    defaultTone: 'Empathetic & Clear',
    defaultFormat: 'Comprehensive FAQs',
    content: `CLINICAL TRIAL EVALUATION: Phase 3 Outcomes of Exagamglogene Autotemcel in Patients with Severe Sickle Cell Disease
Principal Investigator: Dr. Marcus Vance, Institute for Molecular Therapeutics
Published: Journal of Translational Genomic Medicine, 2024

Background and Pathophysiology:
Sickle cell disease (SCD) is an autosomal recessive hemoglobinopathy caused by a single nucleotide substitution (GAG to GTG at codon 6 of the HBB gene), producing abnormal hemoglobin S (HbS). Under hypoxic conditions, HbS undergoes polymerisation, distorting red blood cells into rigid, sickle-shaped erythrocytes. This leads to recurrent, excruciating vaso-occlusive crises (VOCs), chronic hemolytic anemia, end-organ ischemia, and reduced life expectancy (median survival: 42 to 47 years in high-income nations).

Intervention and Mechanism of Action:
Exagamglogene autotemcel (exa-cel) utilizes CRISPR-Cas9 ribonucleoprotein complexes to introduce targeted non-homologous end-joining disruptions at the erythroid-specific enhancer region of the BCL11A gene. In human biology, BCL11A functions as a transcriptional repressor that suppresses fetal hemoglobin (HbF) production shortly after birth. By cleaving the +58 erythroid enhancer of BCL11A in autologous CD34+ hematopoietic stem and progenitor cells (HSPCs), exa-cel reactivates high-level synthesis of fetal hemoglobin (HbF), which does not sickle and physically impedes HbS polymerization.

Study Cohort and Protocol:
Forty-four patients aged 12 to 35 years with severe SCD (defined as having experienced a minimum of two severe VOC episodes per year over the preceding two years; cohort median: 4.0 VOCs/year) underwent mobilization with plerixafor, CD34+ cell collection via apheresis, myeloablative conditioning with intravenous busulfan, and autologous infusion of edited cells.

Clinical Outcomes:
- Thirty-nine of 42 evaluable patients (92.8%) remained completely free of severe vaso-occlusive crises for at least 12 consecutive months during the post-engraftment follow-up period (median follow-up: 22.4 months).
- Mean fetal hemoglobin proportion of total hemoglobin increased from 5.4% at baseline to 41.2% by month 6, persisting stably through month 24.
- Total hemoglobin concentrations rose from a baseline mean of 8.8 g/dL to 12.1 g/dL.
- All patients achieved successful neutrophil engraftment (median: 27 days) and platelet engraftment (median: 34 days).

Adverse Events and Safety Considerations:
No off-target genomic cleavage was detected using high-depth GUIDE-seq and targeted next-generation sequencing assays down to a 0.1% limit of detection. Adverse events were largely attributable to busulfan myeloablative conditioning, including transient stomatitis, febrile neutropenia, and alopecia. No cases of myelodysplastic syndrome or leukemic transformation were reported.`,
  },
  {
    id: 'ai-enterprise-whitepaper',
    title: 'Executive Whitepaper: Enterprise Generative AI Governance & ROI Framework',
    category: 'Business & Technology Strategy',
    description: 'Corporate strategy briefing for C-suite leaders on data privacy, retrieval-augmented generation (RAG), and cost containment.',
    defaultAudience: 'Executive Board / C-Suite',
    defaultReadingLevel: 'Executive Briefing',
    defaultTone: 'Crisp & Executive',
    defaultFormat: 'Executive Summary',
    content: `TRANSFORMING THE ENTERPRISE: A C-SUITE GUIDE TO GENERATIVE AI ARCHITECTURE, RISK, AND CAPITAL ALLOCATION
Strategic Advisory Report — Global Enterprise Technology Council

Executive Problem Statement:
While 84% of Fortune 500 enterprises funded generative AI proof-of-concept (PoC) initiatives in 2023, fewer than 18% have achieved scalable production deployment with measurable net ROI. Organizations are trapped in pilot fatigue driven by three core obstacles: unmanaged infrastructure inference costs, proprietary data leakage risks, and hallucinations eroding operational trust.

Core Strategic Pillars for Production Scale:

1. Retrieval-Augmented Generation (RAG) vs. Fine-Tuning:
Fine-tuning foundational models on proprietary corpora costs an estimated $120,000 to $450,000 per iteration and introduces severe risks of model drift and intellectual property entanglement. For 92% of enterprise use cases (internal knowledge search, customer service resolution, compliance auditing), a hybrid RAG architecture using semantic vector embeddings and deterministic cross-encoders yields superior precision at 85% lower compute expense. Grounding responses directly in verified company repositories reduces model hallucination rates from 14.2% down to 0.7%.

2. Multi-Tiered Governance and RBAC Integration:
Enterprise AI deployments must not permit direct employee access to raw public model endpoints. A hardened API gateway with real-time Personally Identifiable Information (PII) masking, role-based access control (RBAC), and automated token throttling is mandatory. Under this architecture, queries containing customer Social Security Numbers, financial transactions, or unannounced corporate financials are redacted in memory before reaching external model providers.

3. Quantifiable ROI Benchmarks:
Across 30 analyzed multinational enterprises in banking, healthcare, and logistics:
- Automated Tier-1 technical inquiry routing reduced average handle time (AHT) from 18.4 minutes to 4.1 minutes, yielding an average annualized operational saving of $4.2 million.
- Contract review cycle time was compressed by 63%, enabling legal teams to review standard master service agreements in 45 minutes rather than 2.1 hours.
- Average time to positive unit economic payback for centralized AI enablement platforms was 11.2 months.

Final Executive Recommendations:
1. Decommission disconnected departmental shadow AI subscriptions.
2. Establish a unified, central enterprise inference proxy with audited token accounting.
3. Tie executive technology bonuses to production workflow automation rather than exploratory PoC volume.`,
  },
  {
    id: 'shackleton-expedition-narrative',
    title: 'Historical Chronicle: Ernest Shackleton and the Endurance Expedition (1914–1916)',
    category: 'History & Narrative',
    description: 'Historical exploration account of survival in the Antarctic pack ice, the sinking of Endurance, and the rescue of 28 men.',
    defaultAudience: 'Elementary School Students (Grade 4-6)',
    defaultReadingLevel: 'Grade 5 (Simple & Relatable)',
    defaultTone: 'Inspiring & Story-driven',
    defaultFormat: 'Structured Study Notes',
    content: `THE IMPERISHABLE VOYAGE: A Chronicle of Ernest Shackleton and the Trans-Antarctic Expedition
Historical Archives Society, Monograph No. 88

In August 1914, on the eve of the First World War, Sir Ernest Shackleton set sail from Plymouth, England aboard the Endurance, a three-masted wooden barquentine built with solid oak frames up to thirty inches thick, designed specifically for polar navigation. Shackleton's audacious objective was the first land crossing of the Antarctic continent from the Weddell Sea to the Ross Sea via the South Pole, a distance of approximately 1,800 miles across uncharted ice.

The Trap in the Weddell Sea:
In January 1915, when the ship was within one day's sail of its intended landing at Vahsel Bay, an early southern winter gripped the Weddell Sea with unseasonable northeasterly gales. Massive floating ice floes coalesced, cementing the Endurance in pack ice at latitude 76° 34' S. For ten grueling months, the crew of twenty-eight men and sixty-nine sled dogs drifted helplessly with the clockwise gyre of the pack ice, traveling over 1,000 miles without ever touching land. Temperatures regularly plummeted below -35° Fahrenheit.

The Death of the Ship:
On October 27, 1915, immense pressure from shifting ice sheets buckled the Endurance's keel and crushed her rudder and sternpost. Water rushed into the hold. Shackleton ordered all men to abandon ship, salvage essential supplies, three wooden lifeboats (named James Caird, Dudley Docker, and Stancomb Wills), and camp directly onto the drifting sea ice. On November 21, the shattered hull slipped beneath the freezing surface into an ocean abyss 10,000 feet deep.

The Five-Month Ice Drift and the Open Sea:
For five more months, the men camped on fragile ice floes, surviving on penguin and seal meat, melted snow, and dwindling biscuit rations. When the floe began disintegrating under ocean swells in April 1916, they launched the three tiny lifeboats into storm-tossed seas, navigating seven days through icy spray to reach uninhabited Elephant Island—the first solid ground they had stepped upon in 497 days.

The 800-Mile Voyage of the James Caird:
Knowing Elephant Island was completely isolated from shipping lanes, Shackleton and five companions (including navigator Frank Worsley and carpenter Harry McNish) reinforced the 22.5-foot open boat James Caird. Over sixteen harrowing days in hurricane-force winds and fifty-foot waves across the Drake Passage, they navigated 800 nautical miles to South Georgia Island. Using only a pocket sextant when the sun briefly broke through the storm clouds, Worsley guided them with pinpoint accuracy. After trekking across South Georgia's uncharted glaciers, Shackleton reached the Stromness whaling station and organized four rescue attempts, ultimately rescuing every single man left on Elephant Island without losing a single human life.`,
  },
];
