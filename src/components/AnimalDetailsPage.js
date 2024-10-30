import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import '../style/AnimalDetailsPage.css';
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate } from 'react-router-dom';

const AnimalDetails = () => {
  const navigate = useNavigate();
  const { id: animalId } = useParams(); 
  const [animal, setAnimal] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [observations, setObservations] = useState([]);
  const [observationDialogVisible, setObservationDialogVisible] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState(null);
  const [observationToDelete, setObservationToDelete] = useState(null); 
  const [medicalUpdate, setMedicalUpdate] = useState({
    checkupDate: format(new Date(), 'yyyy-MM-dd'),
    healthStatus: '',
    labResults: '',
    nextCheckupDate: '',
    observations: '',
  });

  const [showHealthRecordDialog, setShowHealthRecordDialog] = useState(false);
  const [showMedicationDialog, setShowMedicationDialog] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedHealthRecordId, setSelectedHealthRecordId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState(null);

  const fetchAnimalDetails = useCallback(async () => {
    setLoading(true);
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}`
        );
        console.log("Fetched animal details:", response.data); 
        setAnimal(response.data.animal || {});
        setHealthRecords(response.data.healthRecords || []);
        setError(null);
    } catch (err) {
        console.error(err); 
        setError({
            message: 'Error fetching animal details',
            details: err.response ? err.response.data : err.message,
        });
    } finally {
        setLoading(false);
    }
}, [animalId]);

const fetchMedications = useCallback(async () => {
    if (healthRecords.length === 0) return; 
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/medications`
        );
        console.log("Fetched medications:", response.data); // Log the medications
        setMedications(response.data || []);
    } catch (err) {
        console.error(err); // Log the error
        setError({
            message: 'Error fetching medications',
            details: err.response ? err.response.data : err.message,
        });
    }
}, [animalId, healthRecords]);

const fetchObservations = useCallback(async (animalId) => {
  console.log('Fetching observations for Animal ID:', animalId);
  if (!animalId) return;
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/observations`);
    console.log("Fetched observations:", response.data);
    setObservations(response.data || []);
  } catch (err) {
    console.error("Error fetching observations:", err);
    setError({ message: 'Error fetching observations', details: err.response ? err.response.data : err.message });
  }
}, 
 [animalId]);
useEffect(() => {
  if (animalId) {
    fetchAnimalDetails();
  } else {
    setError({ message: 'Invalid animal ID' });
    setLoading(false);
  }
}, [animalId, fetchAnimalDetails]);

useEffect(() => {
  fetchMedications();
}, [healthRecords, fetchMedications]);

useEffect(() => {
  if (selectedHealthRecordId) {
    console.log("Fetching observations for selected health record ID:", selectedHealthRecordId);
    fetchObservations(selectedHealthRecordId);
  }
}, [selectedHealthRecordId, fetchObservations]);

useEffect(() => {
  if (healthRecords.length > 0) {
    setSelectedHealthRecordId(healthRecords[0].id); 
  }
}, [healthRecords]);


const handleMedicationChange = (event) => {
  const { name, value } = event.target;
  setSelectedMedication((prev) => ({
      ...prev,
      [name]: value,
  }));
};

// Function to handle editing an observation
const handleEditObservation = (observation) => {
  console.log("Editing Observation:", observation);
  setSelectedObservation(observation); 
  setObservationDialogVisible(true); 
};

// Function to submit observation (both create and update)
const submitObservationUpdate = async () => {
  if (!selectedObservation) return;
  try {
    if (selectedObservation.id) {
      // Update existing observation
      await axios.put(`${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/observations/${selectedObservation.id}`, {
        note: selectedObservation.note,
        observation_date: selectedObservation.observation_date,
      });
    } else {
      // Create new observation
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/observations`, {
        note: selectedObservation.note,
        observation_date: selectedObservation.observation_date,
      });
    }
    // Fetch updated observations
    await fetchObservations(animalId); 
    setObservationDialogVisible(false); 
  } catch (err) {
    
    console.error('Error details:', err); 
    setError({ 
      message: 'Error updating observation', 
      details: err.response ? err.response.data : err.message 
    });
  }
};


useEffect(() => {
  if (animalId) {
    fetchAnimalDetails();
  } else {
    setError({ message: 'Invalid animal ID' });
    setLoading(false);
  }
}, [animalId, fetchAnimalDetails]);

  const handleMedicalUpdateChange = (e) => {
    setMedicalUpdate({ ...medicalUpdate, [e.target.name]: e.target.value });
  };
  const handleObservationChange = (e) => {
    setSelectedObservation({
      ...selectedObservation,
      [e.target.name]: e.target.value,
    });
  };
  const submitHealthRecordUpdate = async (recordId) => {
    try {
      if (recordId) {
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/health-records/${recordId}`,
          {
            health_status: medicalUpdate.healthStatus,
            checkup_date: medicalUpdate.checkupDate,
            lab_results: medicalUpdate.labResults,
            next_checkup_date: medicalUpdate.nextCheckupDate,
          }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/health-records`,
          {
            health_status: medicalUpdate.healthStatus,
            checkup_date: medicalUpdate.checkupDate,
            lab_results: medicalUpdate.labResults,
            next_checkup_date: medicalUpdate.nextCheckupDate,
          }
        );
      }
      await fetchAnimalDetails(); 
      setShowHealthRecordDialog(false); 
    } catch (err) {
      setError({
        message: 'Error updating health record',
        details: err.response ? err.response.data : err.message,
      });
    }
  };
  const submitMedicationUpdate = async () => {
    if (!selectedMedication || !animalId || !selectedHealthRecordId) return;

    try {
        if (selectedMedication.id) {
            await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/medications/${selectedMedication.id}`,
                {
                    medication_name: selectedMedication.medication_name,
                    dosage: selectedMedication.dosage,
                    frequency: selectedMedication.frequency,
                    status: selectedMedication.status,
                    start_date: selectedMedication.start_date,
                    end_date: selectedMedication.end_date,
                }
            );
        } else {
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/medications`,
                {
                    medication_name: selectedMedication.medication_name,
                    dosage: selectedMedication.dosage,
                    frequency: selectedMedication.frequency,
                    status: selectedMedication.status,
                    start_date: selectedMedication.start_date,
                    end_date: selectedMedication.end_date,
                }
            );
        }
        await fetchAnimalDetails(); 
        setShowMedicationDialog(false); 
    } catch (err) {
        setError({
            message: 'Error updating medications',
            details: err.response ? err.response.data : err.message,
        });
    }
};

const handleDeleteObservationClick = (observationId) => {
  setObservationToDelete(observationId); 
  setShowDeleteConfirmation(true);      
};

const confirmDeleteObservation = async () => {
  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/observations/${observationToDelete}`);
    await fetchAnimalDetails(); 
    setShowDeleteConfirmation(false); 
    setObservationToDelete(null); 
  } catch (err) {
    setError({
      message: 'Error deleting observation',
      details: err.response ? err.response.data : err.message,
    });
  }
};
  const handleDeleteHealthRecord = async (recordId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this health record? This action cannot be undone.');
    if (!confirmDelete) {
      return; 
    }
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/health-records/${recordId}`);
      await fetchAnimalDetails();  
    } catch (err) {
      setError({
        message: 'Error deleting health record',
        details: err.response ? err.response.data : err.message,
      });
    }
  };
  
  const handleDeleteMedication = (medicationId) => {
    setMedicationToDelete(medicationId); // Set the medication ID to be deleted
    setShowDeleteConfirmation(true); // Show the confirmation modal
  };

  // Function to confirm deletion
  const confirmDeleteMedication = async () => {
    if (medicationToDelete) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/admin/animals/${animalId}/medications/${medicationToDelete}`
        );
        await fetchMedications(); // Refresh the medication list after deletion
      } catch (err) {
        setError({
          message: 'Error deleting medication',
          details: err.response ? err.response.data : err.message,
        });
      } finally {
        setShowDeleteConfirmation(false); // Hide the confirmation modal
        setMedicationToDelete(null); // Clear the medication ID
      }
    }
  };
  const handleHealthRecordSubmit = async (e) => {
    e.preventDefault();
    await submitHealthRecordUpdate(selectedHealthRecordId);
  };
  const handleMedicationSubmit = async (e) => {
    e.preventDefault(); 
    await submitMedicationUpdate();
  };  

  if (loading) {
    return <div>Loading animal details...</div>;
  }

    if (error) {
        return (
          <div>
            <div>{error.message}</div>
            {error.details && (
              <div className="error-details">
                {typeof error.details === 'string' ? error.details : JSON.stringify(error.details)}
              </div>
            )}
          </div>
        );
      }
      
  return (
    <div className="animal-details-page">
      <button onClick={() => navigate('/animals')}>Back to Animal List</button>
      <div className="animal-box">
  <h1>Animal Details</h1>
  {animal.imgurl ? (
    <img src={animal.imgurl} alt={animal.name} className="animal-details-image" />
  ) : (
    <div className="no-image-placeholder">No Image Available</div>
  )}
  
  <h2>{animal.name}</h2>
  
  <div className="animal-details-container">
    {/* Column 1 */}
    <div className="animal-details-column">
      <p>
        <strong>Type:</strong> {animal.type}
      </p>
      <p>
        <strong>Breed:</strong> {animal.breed}
      </p>
      <p>
        <strong>Age:</strong> {animal.age}
      </p>
      <p>
        <strong>Size:</strong> {animal.size}
      </p>
      <p>
        <strong>Birthdate:</strong> {new Date(animal.birthdate).toLocaleDateString()}
      </p>
    </div>
    
    {/* Column 2 */}
    <div className="animal-details-column">
      <p>
        <strong>Location:</strong> {animal.location}
      </p>
      <p>
        <strong>Background:</strong> {animal.background}
      </p>
      <p>
        <strong>Personality:</strong> {animal.personality}
      </p>
      <p>
        <strong>Status:</strong> {animal.status}
      </p>
    </div>
  </div>
  
  <h3>Health Records</h3>
  {healthRecords.length === 0 ? (
    <p>No health records available.</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Checkup Date</th>
          <th>Health Status</th>
          <th>Lab Results</th>
          <th>Next Checkup Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  {healthRecords.map((record) => (
    <tr key={record.id}>
      <td>{format(new Date(record.checkup_date), 'MM/dd/yyyy')}</td>
      <td>{record.health_status}</td>
      <td>{record.lab_results}</td>
      <td>{format(new Date(record.next_checkup_date), 'MM/dd/yyyy')}</td>
      <td>
        <button
          onClick={() => {
            setSelectedHealthRecordId(record.id); 
            setShowHealthRecordDialog(true);
            setMedicalUpdate({
              checkupDate: format(new Date(record.checkup_date), 'yyyy-MM-dd'),
              healthStatus: record.health_status,
              labResults: record.lab_results,
              nextCheckupDate: format(new Date(record.next_checkup_date), 'yyyy-MM-dd'),
            });
          }}
        >
          <i className="fa fa-pencil"></i> 
        </button>
        <button onClick={() => handleDeleteHealthRecord(record.id)}>
          <i className="fa fa-trash"></i> 
        </button>
      </td>
    </tr>
  ))}
</tbody>

    </table>
  )}
  
  <button
    onClick={() => {
      setShowHealthRecordDialog(true);
      setSelectedHealthRecordId(null);
      setMedicalUpdate({
        checkupDate: format(new Date(), 'yyyy-MM-dd'),
        healthStatus: '',
        labResults: '',
        nextCheckupDate: '',
      });
    }}
  >
    Update Health Record
  </button>

  {/* Health Record Dialog Box */}
    {showHealthRecordDialog && (
      <div className="dialog-overlay">
        <div className="dialog-box">
          <h4>{selectedHealthRecordId ? 'Edit Health Record' : 'Add Health Record'}</h4> {/* Display correct title */}
          <form onSubmit={handleHealthRecordSubmit}>
            <div>
              <label>Checkup Date</label>
              <input
                type="date"
                name="checkupDate"
                value={medicalUpdate.checkupDate}
                onChange={handleMedicalUpdateChange}
                required
              />
            </div>
            <div>
              <label>Health Status</label>
              <input
                type="text"
                name="healthStatus"
                value={medicalUpdate.healthStatus}
                onChange={handleMedicalUpdateChange}
                required
              />
            </div>
            <div>
              <label>Lab Results</label>
              <input
                type="text"
                name="labResults"
                value={medicalUpdate.labResults}
                onChange={handleMedicalUpdateChange}
              />
            </div>
            <div>
              <label>Next Checkup Date</label>
              <input
                type="date"
                name="nextCheckupDate"
                value={medicalUpdate.nextCheckupDate}
                onChange={handleMedicalUpdateChange}
              />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowHealthRecordDialog(false)}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    )}
         {/* Medications Section */}
      <h3>Medications</h3>
      {medications.length === 0 ? (
        <p>No medications available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Medication Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Status</th>
              <th>Date Started</th>
              <th>Date Ended</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((medication) => (
              <tr key={medication.id}>
                <td>{medication.medication_name}</td>
                <td>{medication.dosage}</td>
                <td>{medication.frequency}</td>
                <td>{medication.status}</td>
                <td>{format(new Date(medication.start_date), 'MM/dd/yyyy')}</td>
                <td>{medication.end_date ? format(new Date(medication.end_date), 'MM/dd/yyyy') : 'N/A'}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedMedication(medication);
                      setShowMedicationDialog(true);
                    }}
                  >
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button onClick={() => handleDeleteMedication(medication.id)}>
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Button to Add Medication */}
      <button
        onClick={() => {
          setShowMedicationDialog(true);
          setSelectedMedication({});
        }}
      >
        Add Medication
      </button>

      {/* Confirmation Modal for Deletion */}
      {showDeleteConfirmation && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete this medication? This action cannot be undone.</p>
            <button onClick={confirmDeleteMedication}>Yes, Delete</button>
            <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Medication Dialog Box */}
      {showMedicationDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h4>Add Medication</h4>
            <form onSubmit={(e) => { e.preventDefault(); submitMedicationUpdate(); }}>
              <div>
                <label>Medication Name</label>
                <input
                  type="text"
                  name="medication_name"
                  value={selectedMedication.medication_name || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>Dosage</label>
                <input
                  type="text"
                  name="dosage"
                  value={selectedMedication.dosage || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>Frequency</label>
                <input
                  type="text"
                  name="frequency"
                  value={selectedMedication.frequency || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>Status</label>
                <input
                  type="text"
                  name="status"
                  value={selectedMedication.status || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={selectedMedication.start_date || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={selectedMedication.end_date || ''}
                  onChange={handleMedicationChange}
                />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowMedicationDialog(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Medication Dialog Box */}
      {showMedicationDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h4>Add Medication</h4>
            <form onSubmit={(e) => { e.preventDefault(); submitMedicationUpdate(); }}>
              <div>
                <label>Medication Name</label>
                <input
                  type="text"
                  name="medication_name"
                  value={selectedMedication.medication_name || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>Dosage</label>
                <input
                  type="text"
                  name="dosage"
                  value={selectedMedication.dosage || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>Frequency</label>
                <input
                  type="text"
                  name="frequency"
                  value={selectedMedication.frequency || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>Status</label>
                <input
                  type="text"
                  name="status"
                  value={selectedMedication.status || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={selectedMedication.start_date || ''}
                  onChange={handleMedicationChange}
                  required
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={selectedMedication.end_date || ''}
                  onChange={handleMedicationChange}
                />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowMedicationDialog(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <h3>Observations</h3>
        {observations.length === 0 ? (
          <p>No observations available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Observation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((observation) => (
                <tr key={observation.id}>
                  <td>
                    {observation.observation_date
                      ? format(new Date(observation.observation_date), 'MM/dd/yyyy')
                      : 'No Date Available'}
                  </td>
                  <td>{observation.note}</td>
                  <td>
                    <button onClick={() => handleEditObservation(observation)}>
                      <i className="fa fa-pencil"></i>
                    </button>
                    <button onClick={() => handleDeleteObservationClick(observation.id)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {showDeleteConfirmation && (
                <div className="dialog-overlay">
                  <div className="dialog-box">
                    <h4>Confirm Deletion</h4>
                    <p>Are you sure you want to delete this observation? This action cannot be undone.</p>
                    <button onClick={confirmDeleteObservation}>Yes, Delete</button>
                    <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </tbody>
          </table>
        )}

            <button
              onClick={() => {
                setSelectedObservation({});
                setObservationDialogVisible(true);
              }}
            >
      Add Observation
    </button>

       {/* Observation Dialog Box */}
        {observationDialogVisible && (
          <div className="dialog-overlay">
            <div className="dialog-box">
              <h4>{selectedObservation.id ? 'Edit Observation' : 'Add Observation'}</h4>
              <form onSubmit={(e) => { e.preventDefault(); submitObservationUpdate(); }}>
                <div>
                  <label>Observation</label>
                  <input
                    type="text"
                    name="note"
                    value={selectedObservation.note || ''}
                    onChange={handleObservationChange}
                    required
                  />
                </div>
                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    name="observation_date"
                    value={
                      selectedObservation.observation_date
                        ? format(new Date(selectedObservation.observation_date), 'yyyy-MM-dd')
                        : ''
                    }
                    onChange={handleObservationChange}
                    required
                  />
                </div>
                <button type="submit">{selectedObservation.id ? 'Update' : 'Save'}</button>
                <button type="button" onClick={() => setObservationDialogVisible(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
    export default AnimalDetails;