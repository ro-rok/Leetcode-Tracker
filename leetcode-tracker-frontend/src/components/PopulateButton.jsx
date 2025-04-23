import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { toast } from 'react-hot-toast';

export default function PopulateButton({ companyId, onRefresh }) {
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      await api.post(`/companies/${companyId}/refresh`);
      toast.success('Import kicked off! Fetching questions...');
  
      // Wait for 4 seconds to let the job finish (adjust timing if needed)
      setTimeout(async () => {
        if (typeof onRefresh === 'function') {
          await onRefresh();
          toast.success('Questions refreshed!');
        }
      }, 500);
    } catch (e) {
      toast.error('Import failed. Please try again later.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <StyledWrapper>
      <button onClick={run} disabled={busy}>
        <span className="button_top">
          {busy ? '…' : 'Populate'}
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    --button_radius: 0.75em;
    --button_color:rgba(253, 230, 138, 0.66);             /* bg-yellow-300 */
    --button_outline_color:rgb(172, 111, 7);      /* bg-yellow-500 */
    font-size: 14px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    border-radius: var(--button_radius);
    background: var(--button_outline_color);
  }

  .button_top {
    display: block;
    box-sizing: border-box;
    border: 2px solid var(--button_outline_color);
    border-radius: var(--button_radius);
    padding: 0.75em 1.5em;
    background: var(--button_color);
    color: var(--button_outline_color);
    transform: translateY(-0.2em);
    transition: transform 0.1s ease, background 0.3s ease;
  }

  button:hover .button_top {
    transform: translateY(-0.33em);
  }

  button:active .button_top {
    transform: translateY(0);
  }
`
