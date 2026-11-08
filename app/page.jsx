'use client';

import React, { useState, useEffect } from 'react';

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbz12K5cJwuNMUnhF_DWlE6STZ39wNbldq7TUWv7zEjjeTfiHK3qpsoA7RwVfHVfEeHP/exec";

export default function Home() {
  const [config, setConfig] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [resultLinks, setResultLinks] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(GAS_API_URL, { method: 'GET' });
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error("載入試算表失敗：", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTrigger = async (action, actionLabel) => {
    setLoading(true);
    setLoadingText(`正在執行「${actionLabel}」，系統處理中，請稍候...`);
    setCopied(false);

    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: action }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("伺服器回傳格式異常：" + text.substring(0, 150));
      }

      if (data.status === 'error') {
        alert("執行失敗：\n" + data.message);
      } else {
        setResultLinks(data);
      }
    } catch (e) {
      alert("請求失敗：\n" + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyFormLink = (url) => {
    if (!url) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => {
        prompt("請手動按 Ctrl+C 複製表單網址：", url);
      });
    } else {
      prompt("請手動按 Ctrl+C 複製表單網址：", url);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1e293b' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        
        {/* 頂部深藍科技橫幅 */}
        <header style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
          borderRadius: '20px',
          padding: '36px 32px',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
          marginBottom: '24px'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0' }}>審查會議全流程自動化系統</h1>
          <p style={{ fontSize: '14px', color: '#93c5fd', margin: 0 }}>Single Source of Truth ｜ 零安裝全整合的數位籌備工作站</p>
        </header>

        {/* 會議基本資料卡片 */}
        {config && (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)', marginBottom: '24px' }}>
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: '700', color: '#2563eb', background: '#eff6ff', padding: '4px 10px', borderRadius: '9999px', marginBottom: '12px' }}>Session Parameters</span>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px 0' }}>{config.title}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}><span style={{ color: '#64748b', fontSize: '13px' }}>📅 日期：</span><strong style={{ color: '#1e293b' }}>{config.date}</strong></div>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}><span style={{ color: '#64748b', fontSize: '13px' }}>⏰ 起始時間：</span><strong style={{ color: '#1e293b' }}>{config.startTime}</strong></div>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}><span style={{ color: '#64748b', fontSize: '13px' }}>📍 會議地點：</span><strong style={{ color: '#1e293b' }}>{config.location}</strong></div>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}><span style={{ color: '#64748b', fontSize: '13px' }}>👤 主持人：</span><strong style={{ color: '#1e293b' }}>{config.host}</strong></div>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}><span style={{ color: '#64748b', fontSize: '13px' }}>📞 聯絡人：</span><strong style={{ color: '#1e293b' }}>{config.contact}</strong></div>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}><span style={{ color: '#64748b', fontSize: '13px' }}>👥 每案出席上限：</span><strong style={{ color: '#1e293b' }}>{config.maxAttendees} 人</strong></div>
            </div>

            {config.notes && config.notes !== "無" && (
              <div style={{ marginTop: '14px', padding: '12px 14px', background: '#fefce8', borderLeft: '4px solid #f59e0b', borderRadius: '6px', fontSize: '13px', color: '#92400e' }}>
                <strong>📝 備註提醒：</strong>{config.notes}
              </div>
            )}
          </div>
        )}

        {/* 核心操作 4 大按鈕 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <button 
            onClick={() => handleTrigger('GENERATE_AGENDA', '產出開會通知單')} 
            disabled={loading}
            style={{ padding: '16px 18px', border: 'none', borderRadius: '14px', cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', fontWeight: '700', fontSize: '14.5px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            📄 1. 生成會議議程 (Docs)
          </button>

          <button 
            onClick={() => handleTrigger('GENERATE_ATTENDANCE_FORM', '建立受審單位填報表單')} 
            disabled={loading}
            style={{ padding: '16px 18px', border: 'none', borderRadius: '14px', cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#fff', fontWeight: '700', fontSize: '14.5px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            📋 2. 生成出席填報表 (Forms)
          </button>

          <button 
            onClick={() => handleTrigger('GENERATE_SIGNIN_SHEET', '讀取表單彙整簽到單')} 
            disabled={loading}
            style={{ padding: '16px 18px', border: 'none', borderRadius: '14px', cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', fontWeight: '700', fontSize: '14.5px', boxShadow: '0 4
