<#macro emailLayout>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background: linear-gradient(135deg, #1976d2 0%, #115293 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .email-header .icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .email-content {
            padding: 40px 30px;
        }
        .email-content p {
            margin: 15px 0;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            background-color: #1976d2;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            background-color: #115293;
        }
        .email-footer {
            background-color: #f5f5f5;
            padding: 20px 30px;
            text-align: center;
            color: #757575;
            font-size: 14px;
            border-top: 1px solid #e0e0e0;
        }
        .link {
            color: #1976d2;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="icon">📚</div>
            <h1>Bibliothèque en ligne</h1>
        </div>
        <div class="email-content">
            <#nested>
        </div>
        <div class="email-footer">
            <p>© 2026 Système de Gestion de Bibliothèque</p>
            <p>Architecture Microservices</p>
        </div>
    </div>
</body>
</html>
</#macro>
