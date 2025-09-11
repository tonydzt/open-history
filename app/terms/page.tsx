import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">服务条款</h1>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <p className="text-lg">欢迎使用Chronicle（以下简称"本平台"）。通过访问或使用本平台，您同意遵守以下服务条款。请仔细阅读这些条款，因为它们会影响您的法律权利和义务。</p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. 接受条款</h2>
              <p>通过注册账户、访问或使用本平台，您确认您已阅读、理解并同意受本服务条款、隐私政策以及本平台发布的所有其他规则和指导方针的约束。如果您不同意这些条款，您不得使用本平台。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. 平台描述</h2>
              <p>Chronicle是一个多视角事件记录平台，允许用户创建、分享和查看关于各种事件的不同视角。本平台的目的是促进对事件的全面理解，鼓励开放的对话和尊重不同观点。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. 账户注册</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>您必须年满18岁才能在本平台注册账户</li>
                <li>您需要提供准确、真实、最新和完整的个人资料信息</li>
                <li>您负责维护账户的保密性，并对在您账户下发生的所有活动负责</li>
                <li>如果您发现任何未经授权使用您账户的情况，应立即通知我们</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. 用户行为规范</h2>
              <p>在使用本平台时，您同意：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>遵守所有适用的法律法规</li>
                <li>不发布任何非法、有害、威胁性、辱骂性、骚扰性、诽谤性、色情或其他令人反感的内容</li>
                <li>不侵犯他人的知识产权、隐私权或其他合法权利</li>
                <li>不干扰或中断本平台的正常运行</li>
                <li>不尝试未经授权访问本平台的任何部分或功能</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. 内容管理</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>您保留您发布到本平台的所有内容的所有权，但授予我们在全球范围内、非排他性、免版税的许可，以使用、复制、修改、分发和展示这些内容</li>
                <li>本平台有权在不事先通知的情况下移除任何违反本条款的内容</li>
                <li>本平台不对用户发布的内容的准确性、完整性或可靠性负责</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. 知识产权</h2>
              <p>本平台的所有内容、设计、代码、软件和其他材料均受版权、商标和其他知识产权法律的保护。未经我们明确书面许可，您不得复制、修改、分发或以其他方式使用这些材料。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. 终止</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>我们有权在任何时候，基于合理理由，终止或暂停您对本平台的访问，而无需事先通知</li>
                <li>您可以随时通过联系我们来终止您的账户</li>
                <li>在终止后，您必须立即停止使用本平台</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. 免责声明</h2>
              <p>本平台按"原样"提供，不提供任何明示或暗示的保证。我们不保证本平台将不间断、及时、安全或无错误。您使用本平台的风险由您自行承担。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. 责任限制</h2>
              <p>在法律允许的最大范围内，Chronicle及其管理人员、董事、员工、合作伙伴和代理人均不对任何间接、偶然、特殊、后果性或惩罚性损害负责，无论其如何产生，即使我们已被告知此类损害的可能性。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. 条款修改</h2>
              <p>我们可能会不时修改本服务条款。当我们进行重大修改时，我们将在平台上发布更新后的条款，并在适当情况下通过电子邮件通知您。您继续使用本平台将被视为您接受修改后的条款。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. 法律适用</h2>
              <p>本服务条款受中华人民共和国法律管辖，不考虑其冲突法规定。您同意将任何与本条款或本平台有关的争议提交至有管辖权的法院解决。</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. 联系我们</h2>
              <p>如果您对本服务条款有任何问题或疑虑，请随时联系我们：</p>
              <p className="font-medium">support@chronicle.example.com</p>
            </section>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Chronicle. 保留所有权利。</p>
          <div className="mt-2 space-x-4">
            <Link href="/" className="hover:text-primary-600 transition-colors">首页</Link>
            <Link href="/privacy" className="hover:text-primary-600 transition-colors">隐私政策</Link>
          </div>
        </div>
      </main>
    </div>
  );
}