const PurchaseOrder = require('../models/PurchaseOrder');

// --- MASTER DATA ---
const MASTER_DATA = {
    clients: [
        { id: 1, name: "Collabera - Collabera Inc" },
        { id: 2, name: "Microsoft" }
    ],
    jobs: {
        "Collabera - Collabera Inc": [
            { id: "OWNAI_234", title: "Application Development" },
            { id: "CLK_12880", title: "Business Administrator" }
        ],
        "Microsoft": [
            { id: "MS_999", title: "Senior React Dev" }
        ]
    },
    talents: {
        "OWNAI_234": [
            { id: "101", name: "Monika Goyal Test", email: "monika@test.com" },
            { id: "102", name: "Shaili Khatri", email: "shaili@test.com" }
        ],
        "CLK_12880": [{ id: "103", name: "John Doe", email: "john@test.com" }],
        "MS_999": [{ id: "104", name: "Jane Smith", email: "jane@test.com" }]
    }
};

exports.getClients = (req, res) => res.json(MASTER_DATA.clients);

exports.getJobs = (req, res) => {
    const { client } = req.query;
    res.json(MASTER_DATA.jobs[client] || []);
};

exports.getTalents = (req, res) => {
    const { jobId } = req.query;
    res.json(MASTER_DATA.talents[jobId] || []);
};

exports.createPO = async (req, res) => {
    try {
        const newPO = await PurchaseOrder.create(req.body);
        res.status(201).json(newPO);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPOById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the PO in the database
        const po = await PurchaseOrder.findById(id);

        if (!po) {
            return res.status(404).json({ message: "Purchase Order not found" });
        }

        res.status(200).json(po);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};