'use client';

import React, { useState, useEffect } from 'react';

// 請確認此處為您 Apps Script 最新發布的 Web App URL
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbz12K5cJwuNMUnhF_DWlE6STZ39wNbldq7TUWv7zEjjeTfiHK3qpsoA7RwVfHVfEeHP/exec";

export default function Home() {
  const [config, setConfig] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [resultLinks, setResultLinks] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setLoadingText('正在即時同步試算表會議資料...');
    try {
      const res = await fetch(GAS_API_URL);
      const data = await res.json();
      setConfig(data.config);
      setProjects(data.projects || []);
    } catch (e) {
      alert("載入試算表資料失敗！\n1. 請確認 Google 試算表右上角「共用」設為「知道連結的任何人」。\n2. 請確認 Apps Script 部署作業存取權限設為「所有人」。");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTrigger = async (action, actionLabel) => {
    setLoading(true);
    setLoadingText(`正在進行「${actionLabel}」，系統自動處理中，請稍候...`);
    setResultLinks(null);
    try {
      const res = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action }),
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("無法解析伺服器回傳內容：" + text.substring(0, 100));
      }

      if (data.status === 'error') {
        alert('Apps Script 執行回傳錯誤：\n' + data.message);
      } else {
        setResultLinks(data);
      }
    } catch (e) {
      alert('請求失敗：' + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="main-wrapper">
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          background-color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang TC", "Microsoft JhengHei", sans-serif;
          color: #1e293b;
          line-height: 1.6;
        }
        .main-wrapper {
          min-height: 100vh;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
        }
        .container {
          max-width: 960px;
          width: 100%;
        }
        
        /* 標題橫幅 Header */
        .hero-banner {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%);
          border-radius: 20px;
          padding: 36px 32px;
          color: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.25);
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .hero-banner::after {
          content: "";
          position: absolute;
          top: -40px;
          right: -40px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
        }
        .hero-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .hero-desc {
          font-size: 14px;
          color: #93c5fd;
          letter-spacing: 0.5px;
        }

        /* 資訊卡片 Card */
        .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
          margin-bottom: 24px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.06);
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
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
        }

        /* 會議參數網格 */
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
          color: #475569;
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
        }
        .info-item span.label {
          color: #64748b;
          font-size: 13px;
        }
        .info-item span.value {
          font-weight: 600;
          color: #1e293b;
        }
        .notes-box {
          margin-top: 14px;
          padding: 12px 14px;
          background: #fefce8;
          border-left: 4px solid #f59e0b;
          border-radius: 6px;
          font-size: 13px;
          color: #92400e;
        }

        /* 動作按鈕 Action Buttons */
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
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px -3px rgba(0, 0, 0, 0.15);
        }
        .btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(40%);
        }
        .btn-agenda {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }
        .btn-attendance {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }
        .btn-review {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        }

        /* 處理中 Loading 提示條 */
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
          animation: pulse 2s infinite ease-in-out;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid #bfdbfe;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* 成果展示 Results */
        .results-box {
          background: linear-gradient(to right bottom, #fffbeb, #fef3c7);
          border: 1px solid #fde68a;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
        }
        .results-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 14px;
        }
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
          transition: all 0.2s ease;
        }
        .result-link-btn:hover {
          background: #eff6ff;
          border-color: #93c5fd;
          transform: translateX(4px);
        }
        .sheets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        /* 資料表格 Table */
        .table-container {
          overflow-x: auto;
          margin-top: 12px;
        }
        table {
          width:
