/**
 * Inspection checklist loader.
 * Tries the API first; falls back to bundled defaults.
 */

import { getChecklist } from './api.js';

const TYPE_TO_CHECKLIST = {
  'Daily Pre-Task':         'FC-CL-001',
  'Toolbox Talk':           'FC-CL-002',
  'JHSC Monthly':           'FC-CL-003',
  'Pre-Shift':              'FC-CL-004',
  'Incident Investigation': 'FC-CL-005',
  'MOL Response':           'FC-CL-006',
  'Other':                  'FC-CL-007',
};

const FALLBACK_ITEMS = {
  'Daily Pre-Task': [
    { id: 'dt-1', prompt: 'Site hazard assessment completed before work begins.',           type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25' },
    { id: 'dt-2', prompt: 'All workers wearing required PPE (hard hat, hi-vis, CSA boots).', type: 'check', requires_photo: true,  regulatory_ref: 'OReg 213/91 s.21' },
    { id: 'dt-3', prompt: 'Fall protection in place for any WAH task ≥3 m.',               type: 'check', requires_photo: true,  regulatory_ref: 'OReg 213/91 s.26' },
    { id: 'dt-4', prompt: 'Equipment pre-use inspection completed.',                        type: 'check', requires_photo: false, regulatory_ref: 'OReg 213/91 s.96' },
    { id: 'dt-5', prompt: 'First aid kit location known to all workers.',                   type: 'check', requires_photo: false, regulatory_ref: 'WSIA Reg 1101' },
    { id: 'dt-6', prompt: 'Emergency evacuation route posted and communicated.',            type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25' },
    { id: 'dt-7', prompt: 'WHMIS labels on all hazardous materials containers.',            type: 'check', requires_photo: false, regulatory_ref: 'OReg 860 s.5' },
    { id: 'dt-8', prompt: 'No open hazards from previous shift unresolved.',                type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25' },
  ],
  'Toolbox Talk': [
    { id: 'tb-1', prompt: 'Topic selected and materials prepared.',        type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25(2)(a)' },
    { id: 'tb-2', prompt: 'All workers present and attendance recorded.',  type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25(2)(a)' },
    { id: 'tb-3', prompt: 'Topic delivered — key points communicated.',    type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25(2)(a)' },
    { id: 'tb-4', prompt: 'Questions answered and hazards discussed.',     type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25' },
    { id: 'tb-5', prompt: 'Worker sign-off captured for each attendee.',   type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25(2)(a)' },
  ],
  'JHSC Monthly': [
    { id: 'jh-1',  prompt: 'All JHSC members present (quorum met).',                        type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.9' },
    { id: 'jh-2',  prompt: 'Workplace inspection walkthrough completed.',                   type: 'check', requires_photo: true,  regulatory_ref: 'OHSA s.9(26)' },
    { id: 'jh-3',  prompt: 'Open hazards from last month reviewed.',                        type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.9' },
    { id: 'jh-4',  prompt: 'WAH — fall protection equipment inspected.',                    type: 'check', requires_photo: true,  regulatory_ref: 'OReg 213/91 s.26' },
    { id: 'jh-5',  prompt: 'WHMIS — all SDS current and accessible.',                      type: 'check', requires_photo: false, regulatory_ref: 'OReg 860 s.7' },
    { id: 'jh-6',  prompt: 'First aid supplies adequate and in date.',                      type: 'check', requires_photo: true,  regulatory_ref: 'WSIA Reg 1101' },
    { id: 'jh-7',  prompt: 'Fire extinguishers inspected and tagged.',                     type: 'check', requires_photo: true,  regulatory_ref: 'OHSA s.25' },
    { id: 'jh-8',  prompt: 'Emergency exits clear and signage visible.',                   type: 'check', requires_photo: true,  regulatory_ref: 'OHSA s.25' },
    { id: 'jh-9',  prompt: 'Housekeeping — walkways clear, no trip hazards.',              type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25' },
    { id: 'jh-10', prompt: 'Any MOL orders outstanding? Document status.',                  type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.57' },
    { id: 'jh-11', prompt: 'Written recommendations drafted (if applicable).',             type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.9(20)' },
    { id: 'jh-12', prompt: 'Minutes to be distributed within 7 days.',                     type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.9' },
  ],
};

export async function getChecklistForType(inspectionType) {
  const checklistId = TYPE_TO_CHECKLIST[inspectionType];

  if (checklistId) {
    try {
      const result = await getChecklist(checklistId);
      if (result?.items?.length) return result.items;
    } catch (_) { /* fall through to bundled */ }
  }

  return FALLBACK_ITEMS[inspectionType] || [
    { id: 'gen-1', prompt: 'Site conditions assessed before starting.',  type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25' },
    { id: 'gen-2', prompt: 'All workers briefed on the scope of work.', type: 'check', requires_photo: false, regulatory_ref: 'OHSA s.25' },
    { id: 'gen-3', prompt: 'Hazards identified and controlled.',        type: 'check', requires_photo: true,  regulatory_ref: 'OHSA s.25' },
  ];
}
