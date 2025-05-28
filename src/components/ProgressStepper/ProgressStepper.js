// import React from 'react';
// import './ProgressStepper.css';

// const ProgressStepper = ({ steps, currentStep }) => {
//   return (
//     <div className="progress-stepper">
//       <div className="step-dots">
//         {steps.map((step, index) => {
//           const stepStatus = 
//             step.id < currentStep ? 'completed' :
//             step.id === currentStep ? 'active' : 'pending';
          
//           return (
//             <React.Fragment key={step.id}>
//               {index > 0 && (
//                 <div 
//                   className={`step-line ${
//                     steps[index - 1].id < currentStep ? 'completed' : 
//                     steps[index - 1].id === currentStep && steps[index].id === currentStep + 1 ? 'active' : 'pending'
//                   }`}
//                 ></div>
//               )}
//               <div className="step">
//                 <div className={`step-dot ${stepStatus}`}>
//                   {step.id}
//                 </div>
//                 <div className={`step-label ${index % 2 === 0 ? 'top' : 'bottom'}`}>
//                   {step.name}
//                 </div>
//               </div>
//             </React.Fragment>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ProgressStepper;