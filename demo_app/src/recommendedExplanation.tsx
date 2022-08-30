/*eslint-disable*/
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ControlledAccordion() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div style={{marginTop: 70}}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Recommended Schools
          </Typography>
          <Typography sx={{ color: 'text.secondary', textAlign: 'right' }}>Click for an explanation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The table below shows recommended schools based on your income. It uses the &quot;30% 
            rule" to determine affordable rent prices, and calculates monthly mortgage payments based on 
            home prices to determine affordable housing prices. 
          </Typography>
        </AccordionDetails>
      </Accordion>

    </div>
  );
}

