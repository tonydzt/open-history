import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">隐私政策</h1>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p className="text-lg">Chronicle（以下简称"我们"或"本平台"）非常重视您的隐私保护。本隐私政策旨在帮助您了解我们如何收集、使用、存储和保护您的个人信息，以及您可以如何控制这些信息。请仔细阅读本隐私政策。</p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. 我们收集的信息</h2>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3">1.1 您提供的信息</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>账户信息</strong>：当您注册账户时，我们会收集您的姓名、电子邮件地址、头像等信息，这些信息可能通过您使用的第三方登录服务（如Google）提供</li>
                <li><strong>内容信息</strong>：您在本平台上发布的所有内容，包括事件、视角、评论、图片和其他材料</li>
                <li><strong>联系信息</strong>：当您与我们联系时，我们会收集您提供的通信信息</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-4">1.2 自动收集的信息</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>日志信息</strong>：我们收集关于您如何访问和使用本平台的信息，包括您的IP地址、浏览器类型、操作系统、访问日期和时间、页面浏览量等</li>
                <li><strong>设备信息</strong>：我们可能收集关于您使用的设备的信息，包括设备型号、唯一设备标识符等</li>
                <li><strong>Cookies和类似技术</strong>：我们使用Cookies和类似技术来识别您的浏览器或设备，记住您的偏好，并收集有关您如何使用本平台的信息</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. 我们如何使用您的信息</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>提供、维护和改进我们的服务</li>
                <li>处理您的账户注册和登录</li>
                <li>允许您创建、分享和查看内容</li>
                <li>向您发送服务通知、更新和支持信息</li>
                <li>监控和分析本平台的使用情况，以改进用户体验</li>
                <li>防止欺诈、滥用和违反我们服务条款的行为</li>
                <li>遵守法律义务</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. 信息共享与披露</h2>
              <p>我们不会出售您的个人信息。我们可能在以下情况下共享您的信息：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>经您同意</strong>：在获得您的明确同意后，我们可能会共享您的信息</li>
                <li><strong>第三方服务提供商</strong>：我们可能与帮助我们运营本平台的第三方服务提供商共享您的信息，这些提供商必须遵守严格的保密协议</li>
                <li><strong>法律要求</strong>：我们可能在法律要求的情况下，或为了保护我们的权利、财产或安全，或他人的权利、财产或安全而披露您的信息</li>
                <li><strong>企业交易</strong>：在合并、收购、资产转让或类似的企业交易中，如果涉及个人信息转让，我们会要求新的持有您个人信息的公司或组织继续受本隐私政策的约束</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. 信息安全</h2>
              <p>我们采取合理的安全措施来保护您的个人信息免受未经授权的访问、使用或泄露。这些措施包括但不限于数据加密、访问控制、安全审计和定期安全评估。然而，请注意，互联网传输并非完全安全，我们无法保证您通过互联网传输的任何信息的安全性。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. 您的隐私权利</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>访问权</strong>：您有权访问我们持有的关于您的个人信息</li>
                <li><strong>更正权</strong>：您有权要求我们更正不准确的个人信息</li>
                <li><strong>删除权</strong>：在某些情况下，您有权要求我们删除您的个人信息</li>
                <li><strong>限制处理权</strong>：在某些情况下，您有权限制我们处理您的个人信息</li>
                <li><strong>数据可携带权</strong>：您有权以结构化、常用和机器可读的格式接收您提供给我们的个人信息，并有权将这些数据传输给另一个数据控制者</li>
                <li><strong>反对权</strong>：在某些情况下，您有权反对我们处理您的个人信息</li>
                <li><strong>撤回同意权</strong>：如果我们基于您的同意处理您的个人信息，您有权随时撤回您的同意</li>
              </ul>
              <p className="mt-2">要行使上述任何权利，请联系我们：support@chronicle.example.com</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. 未成年人保护</h2>
              <p>本平台不面向18岁以下的未成年人。我们不会故意收集18岁以下未成年人的个人信息。如果我们发现我们在未获得可证实的父母或法定监护人同意的情况下收集了未成年人的个人信息，我们将立即删除相关信息。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. 数据保留</h2>
              <p>我们将在实现本隐私政策所述目的所需的时间内保留您的个人信息，除非法律要求或允许更长的保留期。当我们不再需要您的个人信息时，我们将采取合理措施安全地删除或匿名化这些信息。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. 国际数据传输</h2>
              <p>您的个人信息可能会传输到并存储在位于中国境外的服务器上。我们将采取适当的安全措施，确保您的个人信息得到与中国境内相同水平的保护。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. 隐私政策更新</h2>
              <p>我们可能会不时更新本隐私政策。当我们进行重大修改时，我们将在平台上发布更新后的隐私政策，并在适当情况下通过电子邮件通知您。您继续使用本平台将被视为您接受修改后的隐私政策。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. 联系我们</h2>
              <p>如果您对本隐私政策有任何问题或疑虑，或希望行使您的数据主体权利，请联系我们：</p>
              <p className="font-medium">support@chronicle.example.com</p>
            </section>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Chronicle. 保留所有权利。</p>
          <div className="mt-2 space-x-4">
            <Link href="/" className="hover:text-primary-600 transition-colors">首页</Link>
            <Link href="/terms" className="hover:text-primary-600 transition-colors">服务条款</Link>
          </div>
        </div>
      </main>
    </div>
  );
}