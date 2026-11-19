import { useState } from 'react';
import { BiLike, BiDislike, BiMinus } from 'react-icons/bi';
import './SchemeCard.css';

export default function SchemeCard({ scheme }) {
  const [vote, setVote] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('General');
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (type) => {
    setVote(type);
    setSubmitted(false); // Reset if they change their vote
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log(`Vote: ${vote}, Category: ${category}, Feedback: ${feedback}`);
    // Future API call: axios.post(`/api/schemes/${scheme._id}/feedback`, { vote, category, feedback });
    setSubmitted(true);
    setFeedback('');
  };

  return (
    <div className="scheme-card">
      <div className="scheme-header">
        <div>
          <h2 className="scheme-title">{scheme.title}</h2>
          <span className="scheme-category">{scheme.category}</span>
        </div>
      </div>
      
      <p className="scheme-description">{scheme.description}</p>

      <div className="voting-section">
        <span className="vote-label">Your Take:</span>
        <button 
          onClick={() => handleVote('like')}
          className={`vote-btn ${vote === 'like' ? 'active-like' : ''}`}
        >
          <BiLike /> Like
        </button>
        <button 
          onClick={() => handleVote('neutral')}
          className={`vote-btn ${vote === 'neutral' ? 'active-neutral' : ''}`}
        >
          <BiMinus /> Neutral
        </button>
        <button 
          onClick={() => handleVote('dislike')}
          className={`vote-btn ${vote === 'dislike' ? 'active-dislike' : ''}`}
        >
          <BiDislike /> Dislike
        </button>
      </div>

      {/* Conditionally render feedback form ONLY after a vote is cast */}
      {vote && !submitted && (
        <form className="feedback-section" onSubmit={handleFeedbackSubmit}>
          <label className="vote-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Why did you vote {vote}? (Optional)
          </label>
          
          <select 
            className="feedback-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">General Feedback</option>
            <option value="Implementation">Implementation / Execution</option>
            <option value="Eligibility">Eligibility Criteria</option>
            <option value="Funding">Budget / Funding</option>
          </select>

          <textarea 
            className="feedback-textarea" 
            placeholder="Share your thoughts..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button type="submit" className="submit-btn">Submit Feedback</button>
        </form>
      )}

      {submitted && (
        <p className="success-message">Thank you! Your feedback has been recorded.</p>
      )}
    </div>
  );
}