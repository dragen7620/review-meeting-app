'use client';

import React, { useState, useEffect } from 'react';

// 請確認為最新 Apps Script Web App URL
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbz12K5cJwuNMUnhF_DWlE6STZ39wNbldq7TUWv7zEjjeTfiHK3qpsoA7RwVfHVfEeHP/exec";

export default function Home() {
  const [config, setConfig] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [resultLinks, setResultLinks] = useState(null);

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
    setLoadingText(`正在執行「${actionLabel}」，需時約 10~20 秒，請稍候...`);
    setResultLinks(null);

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
        alert("執行失敗，後端回報錯誤：\n" + data.message);
      } else {
        setResultLinks(data);
      }
    } catch (e) {
      alert("請求失敗：\n" + e.message + "\n\n若此功能涉及新建多份試算表，請確認 Apps Script 已先手動執行授權。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background-color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #1e293b;
          line-height: 1.6;
        }
        .main-wrapper { min-height: 100vh; padding: 40px 20px; display: flex; justify-content: center; }
        .container { max-width: 960px; width: 100%; }
        .hero-banner {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%);
          border-radius: 20px;
          padding: 36px 32px;
          color: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.25);
          margin-bottom: 24px;
        }
        .hero-title { font-size: 28px; font-weight: 800; margin-bottom: 6px; }
        .hero-desc { font-size: 14px; color: #93c5fd; }
        .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
          margin-bottom: 24px;
        }
        .card-header-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: #2563eb;
          background: #eff6ff;
          padding: 4px 10px;
          border-radius: 9999px;
          margin-bottom: 12px;
        }
        .card-title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
          font-size: 14px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
        }
        .info-item span.label { color: #64748b; font-size: 13px; }
        .info-item span.value { font-weight: 600; color: #1e293b; }
        .notes-box {
          margin-top: 14px;
          padding: 12px 14px;
          background: #fefce8;
          border-left: 4px solid #f59e0b;
          border-radius: 6px;
          font-size: 13px;
          color: #92400e;
        }
        .btn-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .btn {
          padding: 18px 20px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }
        .btn:hover:not(:disabled) { transform: translateY(-3px); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-agenda { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); }
        .btn-attendance { background: linear-gradient(135deg, #059669 0%, #047857 100%); }
        .btn-review { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }
        .loading-bar {
          background: #ffffff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 14px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #1d4ed8;
          font-weight: 600;
          font-size: 14px;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid #bfdbfe;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .results-box {
          background: linear-gradient(to right bottom, #fffbeb, #fef3c7);
          border: 1px solid #fde68a;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .results-header { font-size: 16px; font-weight: 700; color: #92400e; margin-bottom: 14px; }
        .result-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid #fde68a;
          color: #1e40af;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          margin: 4px 0;
        }
        .sheets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        .table-container { overflow-x: auto; margin-top: 12px; }
        table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13.5px; }
        th {
          background-color: #f8fafc;
          color: #64748b;
          font-weight: 600;
          font-size: 12px;
          padding: 12px 14px;
          border-bottom: 2px solid #e2e8f0;
        }
        td { padding: 14px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        .badge-id { background: #e2e8f0; color: #334155; font-weight: 700; padding: 3px 8px; border-radius: 6px; font-size: 12px; }
        .badge-unit { background: #ecfdf5; color: #065f46; padding: 2px 8px; border-radius: 6px; }
        .budget-cell { font-family: monospace; font-weight: 700; text-align: right; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="container">
        <header className="hero-banner">
          <h1 className="hero-title">審查會議全流程自動化系統</h1>
          <p className="hero-desc">Single Source of Truth ｜ 零安裝全整合的數位籌備工作站</p>
        </header>

        {config && (
          <div className="card">
            <span className="card-header-tag">Session Parameters</span>
            <h2 className="card-title">{config.title}</h2>
            
            <div className="info-grid">
              <div className="info-item"><span className="label">📅 日期</span><span className="value">{config.date}</span></div>
              <div className="info-item"><span className="label">⏰ 起始時間</span><span className="value">{config.startTime}</span></div>
              <div className="info-item"><span className="label">📍 會議地點</span><span className="value">{config.location}</span></div>
              <div className="info-item"><span className="label">👤 主持人</span><span className="value">{config.host}</span></div>
              <div className="info-item"><span className="label">📞 聯絡人</span><span className="value">{config.contact}</span></div>
              <div className="info-item"><span className="label">👥 每案出席上限</span><span className="value">{config.maxAttendees} 人</span></div>
            </div>

            {config.notes && config.notes !== "無" && (
              <div className="notes-box"><strong>📝 備註提醒：</strong>{config.notes}</div>
            )}
          </div>
        )}

        <div className="btn-group">
          <button 
            onClick={() => handleTrigger('GENERATE_AGENDA', '產出 Docs 議程')} 
            disabled={loading}
            className="btn btn-agenda">
            <span>📄</span> 一鍵生成會議議程 (Docs)
          </button>

          <button 
            onClick={() => handleTrigger('GENERATE_ATTENDANCE_FORM', '建立出席名單表單')} 
            disabled={loading}
            className="btn btn-attendance">
            <span>📋</span> 一鍵生成出席名單表 (Forms)
          </button>

          <button 
            onClick={() => handleTrigger('GENERATE_REVIEW_SHEETS', '裂變委員專屬審查表')} 
            disabled={loading}
            className="btn btn-review">
            <span>📊</span> 裂變委員專屬審查表 (Sheets)
          </button>
        </div>

        {loading && (
          <div className="loading-bar">
            <div className="spinner"></div>
            <span>{loadingText}</span>
          </div>
        )}

        {resultLinks && (
          <div className="results-box">
            <div className="results-header">🎉 雲端文件已產出就緒：</div>

            {resultLinks.url && (
              <div>
                <a href={resultLinks.url} target="_blank" rel="noreferrer" className="result-link-btn">
                  📄 開啟已產出的 Docs 議程文件 ↗
                </a>
              </div>
            )}

            {resultLinks.formUrl && (
              <div>
                <a href={resultLinks.formUrl} target="_blank" rel="noreferrer" className="result-link-btn" style={{ color: '#047857' }}>
                  📋 開啟受審單位出席填報表單 ↗
                </a>
              </div>
            )}

            {resultLinks.sheets && (
              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>各委員專屬獨立審查表：</p>
                <div className="sheets-grid">
                  {resultLinks.sheets.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer" className="result-link-btn" style={{ color: '#4338ca', fontSize: '13px' }}>
                      📊 {s.reviewer} 審查表 ↗
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>當前排程案件清單</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>共 {projects.length} 件排程審查案</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>編號</th>
                  <th>總計畫名稱</th>
                  <th>細部計畫名稱</th>
                  <th>執行單位</th>
                  <th style={{ textAlign: 'right' }}>經費 (千元)</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>尚無資料</td></tr>
                ) : (
                  projects.map((p, idx) => (
                    <tr key={idx}>
                      <td><span className="badge-id">{p.caseId}</span></td>
                      <td style={{ fontWeight: '500' }}>{p.mainTitle}</td>
                      <td style={{ color: '#0284c7', fontWeight: '500' }}>{p.subTitle}</td>
                      <td><span className="badge-unit">{p.unit}</span></td>
                      <td className="budget-cell">{p.budget?.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
