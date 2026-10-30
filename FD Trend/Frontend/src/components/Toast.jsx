import React from 'react';
import {useAuth} from '../context/AuthContext';
export default function Toast(){const {toast}=useAuth();if(!toast)return null;return <div style={{position:'fixed',right:20,bottom:20,zIndex:120,background:'var(--ink)',color:'var(--white)',border:'1px solid #555',padding:'13px 16px',fontSize:10,letterSpacing:'.08em',maxWidth:320}}>{toast.message}</div>}
