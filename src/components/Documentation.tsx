import { Box, Link, Typography } from "@mui/material";

export const Documentation = () => {
  return (
    <Box sx={{ "& > .MuiTypography-root": { mb: 1 } }}>
      <Typography variant="h6">Notes on data sources</Typography>
      <Typography>Coming soon!</Typography>
      <Typography variant="h6">Acknowledgements</Typography>
      <Typography>
        We thank all of the organizations and individuals who make their data
        available for health monitoring and research.
      </Typography>
      <Typography>
        Some data used in this platform come from Epic Cosmos, a dataset created
        in collaboration with a community of Epic health systems representing
        more than 295 million patient records from over 1633 hospitals and
        37,900 clinics from all 50 states, D.C., Lebanon, and Saudi Arabia. Epic
        data were obtained using the SlicerDicer tool in{" "}
        <Link href="https://www.epicresearch.org/about-us">Epic Cosmos</Link>.
        and are presented here for non-commercial purposes.
      </Typography>
      <Typography>
        Google Trends data, representing search volume by week and state or
        metropolitan area, are obtained from the{" "}
        <Link href="https://developers.google.com/terms/">
          Google Trends API
        </Link>{" "}
        for non-commercial purposes.
      </Typography>
      <Typography>Contributors include: </Typography>
      <Typography>
        Data wrangling, code, visualization: Shelby Golden, Howard Baik, Micah
        Iserman, Maurice Dalton, Deus Thindwa, Stephanie Perniciaro, Dan
        Weinberger, Evan Cohen, Hanmeng Xu, Delphi/CMU, Epic/Cosmos
      </Typography>
      <Typography>
        Project Leadership and Partners: Megan Ranney, Bhramar Mukherjee,
        Katelyn Jetelina, Ron Borzekowski, Anne Zink, and Dan Weinberger
      </Typography>
      <Typography>
        Feedback or suggestions?{" "}
        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSchAasiq7ovCCNz9ussb7C2ntkZ-8Rjc7-tNSglkf5boS-A0w/viewform?usp=dialog">
          Let us know!
        </Link>
      </Typography>
      <Typography variant="h6">Legal Disclaimer</Typography>
      <Typography>
        These data and PopHIVE statistical outputs are provided “as is”, without
        warranty of any kind, express or implied, including but not limited to
        the warranties of merchantability, fitness for a particular purpose, and
        noninfringement. In no event shall the authors, contributors, or
        copyright holders be liable for any claim, damages, or other liability,
        whether in an action of contract, tort, or otherwise, arising from, out
        of, or in connection with the data or the use or other dealings in the
        data.The PopHIVE statistical outputs are research tools intended for use
        in the fields of public health and medicine. They are not intended for
        clinical decision making, are not intended to be used in the diagnosis
        or treatment of patients and may not be useful or appropriate for any
        clinical purpose. Users of the PopHIVE statistical outputs should be
        aware of their responsibilities to ensure the ethical and appropriate
        use of this technology, including adherence to any applicable legal and
        regulatory requirements. The content and data provided with the
        statistical outputs do not replace the expertise of healthcare
        professionals. Healthcare professionals should use their professional
        judgment in evaluating the outputs of the PopHIVE statistical outputs.
      </Typography>
    </Box>
  );
};
