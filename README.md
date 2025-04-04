# PopHIVE Prototype Aims and Scope

## Aims

**Primary goal:** Reproduce [ysph-dsde/DSDE-PopHIVE](https://github.com/ysph-dsde/DSDE-PopHIVE) as it looks since March 10th in JavaScript with one additional page as a simple landing page. The original outline for PopHIVE was borrowed from a previous project that Dan had going on, with the most original version reflected in his GitHub at [DanWeinberger/PopHIVE](https://github.com/DanWeinberger/PopHIVE/tree/main). Dan shared some preferred color pallets for the plots: [saturated](https://colorbrewer2.org/#type=qualitative&scheme=Paired&n=10) and [muted](https://colorbrewer2.org/#type=qualitative&scheme=Set3&n=10).

**Secondary goal:** Suggest improvements on website structure, organization, and aesthetics. Give advice on best practices that are currently reflected in the DSDE-PopHIVE Quarto file and best practices that need to be implemented going forward. NOTE: we do not have a set branding (website color palette, font families, etc.) for PopHIVE. We are using the YSPH logo and favicon for the time being.

**Tertiary goal:** Add plot blocks into the dashboard webpage skeleton for recently harmonized and cleaned datasets from new domains of research.

## Scope

- Two webpages:

    1. Landing page with the title, authors, and link to the dashboard.
    2. Dashboard that is a reproduction of DSDE-PopHIVE as it is as of March 10th.
 
- Three prepared datasets:

    1. Respiratory_Infections.gz.parquet (source DSDE-PopHIVE/Data - [file URL](https://github.com/ysph-dsde/DSDE-PopHIVE/raw/refs/heads/main/Data/Respiratory_Infections.gz.parquet))
    2. Respiratory_Infections_Wastewater.gz.parquet (source DSDE-PopHIVE/Data - [file URL](https://github.com/ysph-dsde/DSDE-PopHIVE/raw/refs/heads/main/Data/Respiratory_Infections_Wastewater.gz.parquet))
    3. Opioid_Overdoses.csv (source DSDE-PopHIVE/Data - [file URL](https://github.com/ysph-dsde/DSDE-PopHIVE/raw/refs/heads/main/Data/Opioid_Overdoses.csv))

- Plot types:

    1. Within one data source (i.e. RSV-NET, NSSP, Epic Cosmos, etc.) that show rates and counts stratified by geolocation, age, sex, and race/ethnicity.
    2. Between data sources that show scaled counts. This version might have a lot of NA's.

  NOTE: Reference [ysph-dsde/data-gov](https://github.com/ysph-dsde/data-gov) file `Suggested Static Plots.R` for guidance on plotting from the three prepared datasets.


## Legal Disclaimer

These data and PopHIVE statistical outputs are provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the authors, contributors, or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the data or the use or other dealings in the data.

The PopHIVE statistical outputs are research tools intended for use in the fields of public health and medicine. They are not intended for clinical decision making, are not intended to be used in the diagnosis or treatment of patients and may not be useful or appropriate for any clinical purpose. Users of the PopHIVE statistical outputs should be aware of their responsibilities to ensure the ethical and appropriate use of this technology, including adherence to any applicable legal and regulatory requirements.

The content and data provided with the statistical outputs do not replace the expertise of healthcare professionals. Healthcare professionals should use their professional judgment in evaluating the outputs of the PopHIVE statistical outputs.
  
