import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    formData: {
        clientName: '',
        poType: '',
        poNo: '',
        receivedOn: '',
        receivedFromName: '',
        receivedFromEmail: '',
        poStartDate: '',
        poEndDate: '',
        budget: '',
        currency: 'USD',
        talentsDetails: [{ sectionId: Date.now(), jobTitle: '', jobId: '', selectedTalents: [] }]
    },
    isReadOnly: false,
};

const poSlice = createSlice({
    name: 'po',
    initialState,
    reducers: {
        setField: (state, action) => {
            const { name, value } = action.payload;
            state.formData[name] = value;
            if (name === 'poType') {
                state.formData.talentsDetails.forEach(s => s.selectedTalents = []);
            }
        },
        // 1. NEW: Action to populate form from Backend Data
        setAllFormData: (state, action) => {
            // We merge incoming data with defaults to prevent errors if some fields are missing
            state.formData = { ...state.formData, ...action.payload };

            // If viewing an existing PO, usually we set it to ReadOnly initially
            // state.isReadOnly = true; // Optional: Uncomment if you want edit mode to start as read-only
        },
        addSection: (state) => {
            state.formData.talentsDetails.push({
                sectionId: Date.now(), jobTitle: '', jobId: '', selectedTalents: []
            });
        },
        removeSection: (state, action) => {
            state.formData.talentsDetails.splice(action.payload, 1);
        },
        setJobForSection: (state, action) => {
            const { index, jobTitle, jobId } = action.payload;
            state.formData.talentsDetails[index].jobTitle = jobTitle;
            state.formData.talentsDetails[index].jobId = jobId;
            state.formData.talentsDetails[index].selectedTalents = [];
        },
        toggleTalent: (state, action) => {
            const { sectionIndex, talent } = action.payload;
            const section = state.formData.talentsDetails[sectionIndex];
            const existingIdx = section.selectedTalents.findIndex(t => t.id === talent.id);

            if (existingIdx > -1) {
                section.selectedTalents.splice(existingIdx, 1);
            } else {
                if (state.formData.poType === 'Individual PO' && section.selectedTalents.length > 0) return;

                section.selectedTalents.push({
                    ...talent,
                    contractDuration: '',
                    billRate: '', billRateCurrency: 'USD',
                    standardTimeBR: '', standardTimeBRCurrency: 'USD',
                    overTimeBR: '', overTimeBRCurrency: 'USD'
                });
            }
        },
        setTalentField: (state, action) => {
            const { sectionIndex, talentId, field, value } = action.payload;
            const talent = state.formData.talentsDetails[sectionIndex].selectedTalents.find(t => t.id === talentId);
            if (talent) talent[field] = value;
        },
        resetForm: (state) => {
            state.formData = initialState.formData;
            state.isReadOnly = false;
        },
        setReadOnly: (state, action) => {
            state.isReadOnly = action.payload;
        }
    }
});

export const {
    setField, addSection, removeSection, setJobForSection,
    toggleTalent, setTalentField, resetForm, setReadOnly,
    setAllFormData // Export this action
} = poSlice.actions;

export default poSlice.reducer;